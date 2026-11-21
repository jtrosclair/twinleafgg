import { GustOpponentBenchEffect } from '../effects/attack-effects';
import { GameError } from '../../game-error';
import { GameLog, GameMessage } from '../../game-message';
import { Effect } from '../effects/effect';
import { GamePhase, State } from '../state/state';
import { StoreLike } from '../store-like';
import {
  PutDamageEffect, DealDamageEffect, DiscardCardsEffect,
  AddMarkerEffect, HealTargetEffect, AddSpecialConditionsEffect,
  RemoveSpecialConditionsEffect, ApplyWeaknessEffect, AfterDamageEffect,
  PutCountersEffect, CardsToHandEffect,
  DirectKnockOutAttackEffect, KnockOutOpponentEffect,
  KOEffect,
  LostZoneCardsEffect,
  AfterWeaknessAndResistanceEffect
} from '../effects/attack-effects';
import { CoinFlipEffect } from '../effects/play-card-effects';
import { AttackEffect, HealEffect } from '../effects/game-effects';
import { StateUtils } from '../state-utils';
import { MarkerConstants } from '../markers/marker-constants';
import { getCardTarget } from '../../../simple-bot/simple-tactics/simple-tactics';
import { EffectOfAttackEffect } from '../effects/effect-of-attack-effects';
import { GameStatsTracker } from '../game-stats-tracker';
import { CheckHpEffect, CheckPokemonTypeEffect, CheckProvidedEnergyEffect } from '../effects/check-effects';
import { CardTag, CardType } from '../card/card-types';
import { COIN_FLIP_PROMPT, IS_ABILITY_BLOCKED } from '../prefabs/prefabs';
import { scheduleEffectKnockOut } from './check-effect';
import { attackDamagePositions, attackEffectKnockOuts } from '../state/pokemon-card-list';
import { Player } from '../state/player';
import { PokemonCard } from '../card/pokemon-card';
import { getWillCoinChoicePlayer } from '../prefabs/will-coin-choice';

export function getActiveAttackDamageBonus(effect: DealDamageEffect | PutDamageEffect): number {
  const bonus = effect.source.activeDamageBonusNextTurn;
  return bonus && !bonus.pending && effect.damage > 0 && effect.target === effect.opponent.active ? bonus.amount : 0;
}

export function attackReducer(store: StoreLike, state: State, effect: Effect): State {
  if (effect instanceof GustOpponentBenchEffect) {
    effect.opponent.switchPokemon(effect.target, store, state);
    return state;
  }

  if (effect instanceof PutDamageEffect) {
    const target = effect.target;
    const sourceOwner = StateUtils.findOwner(state, effect.source);
    const targetCard = target.getPokemonCard();

    if (targetCard === undefined) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }

    // Reflect Shield: ask before applying attack damage; heads prevents this
    // damage and reflects counters onto the attacker, while tails takes damage.
    const shieldRetaliation = target.retaliateOnDamageNextTurn;
    const ignoreDefendingDamageEffects = effect.ignoresDefendingDamageEffects;
    const targetOwner = StateUtils.findOwner(state, target);
    if (!ignoreDefendingDamageEffects && !(effect as any).reflectShieldFlipResolved
      && effect.attackEffect
      && effect.damage > 0
      && shieldRetaliation !== null
      && 'coinFlipPrevent' in shieldRetaliation
      && shieldRetaliation.coinFlipPrevent === true
      && shieldRetaliation.attackerPlayerId === targetOwner.id
      && StateUtils.getOpponent(state, targetOwner) === effect.player) {
      return COIN_FLIP_PROMPT(store, state, targetOwner, result => {
        (effect as any).reflectShieldFlipResolved = true;
        if (result) {
          effect.damage = 0;
          const revenge = new AttackEffect(targetOwner, effect.player, shieldRetaliation.attack);
          revenge.source = target;
          const counters = new PutCountersEffect(revenge, shieldRetaliation.damage);
          counters.target = effect.source;
          store.reduceEffect(state, counters);
        }
        store.reduceEffect(state, effect);
      });
    }

    if (effect.attackEffect) {
      if (!effect.weaknessApplied) effect.damage += getActiveAttackDamageBonus(effect);
      effect.damage += effect.source.attackDamageBonusNextTurn;
    }

    if (!ignoreDefendingDamageEffects && target.damageReductionBeforeWeaknessNextTurn > 0) {
      effect.damage = Math.max(0, effect.damage - target.damageReductionBeforeWeaknessNextTurn);
    }

    const opponent = StateUtils.getOpponent(state, effect.player);
    if (target !== opponent.active && !effect.weaknessApplied) {
      effect.damage = Math.max(0,
        effect.damage - effect.source.attackDamageReductionNextTurn - effect.attackDamageReductionBeforeWeakness);
    }

    if (effect.attackEffect && target === opponent.active && !effect.weaknessApplied) {
      // Apply weakness
      const applyWeakness = new ApplyWeaknessEffect(effect.attackEffect, effect.damage);
      applyWeakness.target = effect.target;
      applyWeakness.ignoreWeakness = effect.attackEffect.ignoreWeakness || (!ignoreDefendingDamageEffects && target.noWeaknessNextTurn);
      applyWeakness.ignoreResistance = effect.attackEffect.ignoreResistance;
      state = store.reduceEffect(state, applyWeakness);

      effect.damage = applyWeakness.damage;

      const targetOwner = StateUtils.findOwner(state, target);
      targetOwner.marker.addMarkerToState(targetOwner.DAMAGE_DEALT_MARKER);
    }

    if (effect.damage > 0) {
      effect.damage += effect.damageBonusAfterWeakness;
      if (!ignoreDefendingDamageEffects && state.phase === GamePhase.ATTACK
        && state.players[state.activePlayer] === sourceOwner && targetOwner !== sourceOwner
        && target.marker.hasMarker(MarkerConstants.MABOSSTIFF_HEADBUTT_DAMAGE)) {
        effect.damage += 100;
      }
    }
    if (!ignoreDefendingDamageEffects && state.phase === GamePhase.ATTACK && sourceOwner !== targetOwner
      && sourceOwner === state.players[state.activePlayer] && effect.source.getPokemonCard()) {
      const protections = targetOwner.marker.markers;
      const jasmineCount = protections.filter(marker => marker.name === MarkerConstants.JASMINES_GAZE_MARKER).length;
      const ironCount = protections.filter(marker => marker.name === MarkerConstants.IRON_DEFENDER_MARKER).length;
      if (jasmineCount > 0) effect.reduceDamageAfterWeakness(30 * jasmineCount);
      if (ironCount > 0) {
        const type = new CheckPokemonTypeEffect(target);
        state = store.reduceEffect(state, type);
        if (type.cardTypes.includes(CardType.METAL)) effect.reduceDamageAfterWeakness(30 * ironCount);
      }
    }
    effect.applyPostWeaknessReductions();

    if (!ignoreDefendingDamageEffects && target.preventDamageUpToNextTurn > 0
      && effect.damage <= target.preventDamageUpToNextTurn) {
      effect.preventDefault = true;
      return state;
    }

    // Apply damage reduction for "during opponent's next turn" effects
    const reductionFilter = target.damageReductionNextTurnFilter;
    const attackerStage = effect.source.getPokemonCard()?.stage;
    if (!ignoreDefendingDamageEffects && target.damageReductionNextTurn > 0
      && (!reductionFilter?.sourceIsEvolution || StateUtils.isEvolutionPokemon(effect.source))
      && (reductionFilter?.sourceStage === undefined || attackerStage === reductionFilter.sourceStage)) {
      effect.damage = Math.max(0, effect.damage - target.damageReductionNextTurn);
    }

    if (!ignoreDefendingDamageEffects && target.defendingPokemonExtraDamageNextTurn > 0 && !target.defendingPokemonExtraDamagePending
      && target.defendingPokemonExtraDamageAttackerId === effect.player.id) {
      effect.damage += target.defendingPokemonExtraDamageNextTurn;
    }
    if (!ignoreDefendingDamageEffects && effect.preventDamageAtOrAbove !== undefined
      && effect.damage >= effect.preventDamageAtOrAbove) {
      effect.preventDefault = true;
      return state;
    }

    if (canFlipToPreventDamage(store, state, effect, targetOwner)) {
      const prevent = () => {
        effect.preventDefault = true;
        store.log(state, GameLog.LOG_ABILITY_BLOCKS_DAMAGE, { name: targetOwner.name, pokemon: targetCard.name });
      };
      if (getWillCoinChoicePlayer(state) === targetOwner) {
        const coin = new CoinFlipEffect(targetOwner, heads => {
          if (heads) prevent();
          else applyAttackDamage(store, state, effect, targetCard, targetOwner, sourceOwner);
        });
        coin.skipAttackReflip = true;
        return store.reduceEffect(state, coin);
      }
      const coin = new CoinFlipEffect(targetOwner);
      coin.skipAttackReflip = true;
      state = store.reduceEffect(state, coin);
      if (coin.result === true) {
        prevent();
        return state;
      }
    }
    return applyAttackDamage(store, state, effect, targetCard, targetOwner, sourceOwner);
  }

  if (effect instanceof AfterWeaknessAndResistanceEffect) {
    const target = effect.target;
    const damage = Math.max(0, effect.damage);
    target.damage += damage;

    // Track damage dealt by the attacking Pokemon
    if (damage > 0 && effect.attackEffect && effect.source) {
      GameStatsTracker.trackDamageDealt(effect.player, effect.source, damage);
    }
  }

  if (effect instanceof DealDamageEffect) {
    const base = effect.attackEffect;

    const applyWeakness = new ApplyWeaknessEffect(base, effect.damage);
    applyWeakness.target = effect.target;
    applyWeakness.ignoreWeakness = base.ignoreWeakness;
    applyWeakness.ignoreResistance = base.ignoreResistance;
    state = store.reduceEffect(state, applyWeakness);

    const dealDamage = new PutDamageEffect(base, applyWeakness.damage);
    dealDamage.target = effect.target;
    dealDamage.weaknessApplied = true;
    state = store.reduceEffect(state, dealDamage);

    return state;
  }

  if (effect instanceof KOEffect) {
    const target = effect.target;
    const pokemonCard = target.getPokemonCard();
    if (pokemonCard === undefined) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }

    // Check if the effect is part of an attack and the target is the opponent's active Pokemon
    const opponent = StateUtils.getOpponent(state, effect.player);
    if (effect.attackEffect && target === opponent.active) {
      // Apply weakness
      const applyWeakness = new ApplyWeaknessEffect(effect.attackEffect, effect.damage);
      applyWeakness.target = effect.target;
      applyWeakness.ignoreWeakness = effect.attackEffect.ignoreWeakness;
      applyWeakness.ignoreResistance = effect.attackEffect.ignoreResistance;
      state = store.reduceEffect(state, applyWeakness);

      effect.damage = applyWeakness.damage;

    }

    const damage = Math.max(0, effect.damage);
    target.damage += damage;

    const targetOwner = StateUtils.findOwner(state, target);
    targetOwner.marker.addMarkerToState(effect.player.DAMAGE_DEALT_MARKER);

    if (damage > 0) {
      // Track damage dealt by the attacking Pokemon
      if (effect.attackEffect && effect.source) {
        GameStatsTracker.trackDamageDealt(effect.player, effect.source, damage);
      }

      const afterDamageEffect = new AfterDamageEffect(effect.attackEffect, damage);
      afterDamageEffect.target = effect.target;
      store.reduceEffect(state, afterDamageEffect);
    }
  }

  if (effect instanceof DirectKnockOutAttackEffect) {
    const target = effect.target.getPokemonCard();
    if (target) scheduleEffectKnockOut(state, target);
    return state;
  }

  if (effect instanceof KnockOutOpponentEffect) {
    const target = effect.target;
    const pokemonCard = target.getPokemonCard();
    if (pokemonCard === undefined) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }

    const damage = Math.max(0, effect.damage);
    const damageBefore = target.damage;
    target.damage += damage;
    effect.knockedOut = recordAttackEffectKnockOut(store, state, effect, damageBefore);

    // Track damage dealt by the attacking Pokemon
    if (damage > 0 && effect.attackEffect && effect.source) {
      GameStatsTracker.trackDamageDealt(effect.player, effect.source, damage);
    }
  }

  if (effect instanceof PutCountersEffect) {
    const target = effect.target;
    const sourceOwner = StateUtils.findOwner(state, effect.source);
    const targetCard = target.getPokemonCard();
    if (targetCard === undefined) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }

    const damage = Math.max(0, effect.damage);
    const damageBefore = target.damage;
    target.damage += damage;
    recordAttackEffectKnockOut(store, state, effect, damageBefore);

    if (damage > 0) {
      store.log(state, GameLog.LOG_PLAYER_PLACES_DAMAGE_COUNTERS, {
        name: sourceOwner.name,
        damage: damage,
        target: targetCard.name,
        effect: effect.attack.name,
      });

      // Track damage dealt by the attacking Pokemon
      if (effect.attackEffect && effect.source) {
        GameStatsTracker.trackDamageDealt(effect.player, effect.source, damage);
      }
    }
  }

  if (effect instanceof AfterDamageEffect) {
    const targetOwner = StateUtils.findOwner(state, effect.target);
    targetOwner.marker.addMarkerToState(effect.player.DAMAGE_DEALT_MARKER);
  }

  if (effect instanceof DiscardCardsEffect) {
    const target = effect.target;
    const cards = effect.cards;
    const owner = StateUtils.findOwner(state, target);
    // Preserve DiscardCardsEffect interception, then apply the Prism Star
    // replacement to the cards still being discarded.
    const prismStars = cards.filter(card => card.tags.includes(CardTag.PRISM_STAR));
    const normal = cards.filter(card => !card.tags.includes(CardTag.PRISM_STAR));
    target.moveCardsTo(prismStars, owner.lostzone);
    target.moveCardsTo(normal, owner.discard);
    return state;
  }

  if (effect instanceof LostZoneCardsEffect) {
    const target = effect.target;
    const cards = effect.cards;
    const owner = StateUtils.findOwner(state, target);
    target.moveCardsTo(cards, owner.lostzone);
    return state;
  }

  if (effect instanceof CardsToHandEffect) {
    const target = effect.target;
    const cards = effect.cards;
    const owner = StateUtils.findOwner(state, target);
    target.moveCardsTo(cards, owner.hand);
    return state;
  }

  if (effect instanceof AddMarkerEffect) {
    const target = effect.target;
    target.marker.addMarker(effect.markerName, effect.markerSource);
    return state;
  }

  if (effect instanceof HealTargetEffect) {
    const target = effect.target;
    const owner = StateUtils.findOwner(state, target);
    const healEffect = new HealEffect(owner, target, effect.damage);
    state = store.reduceEffect(state, healEffect);
    return state;
  }

  if (effect instanceof AddSpecialConditionsEffect) {
    const target = effect.target;
    effect.specialConditions.forEach(sp => {
      target.addSpecialCondition(sp);
    });
    if (effect.poisonDamage !== undefined) {
      target.poisonDamage = effect.poisonDamage;
    }
    if (effect.burnDamage !== undefined) {
      target.burnDamage = effect.burnDamage;
    }
    if (effect.confusionDamage !== undefined) {
      target.confusionDamage = effect.confusionDamage;
    }
    if (effect.sleepFlips !== undefined) {
      target.sleepFlips = effect.sleepFlips;
    }
    return state;
  }

  if (effect instanceof RemoveSpecialConditionsEffect) {
    const target = effect.target;
    effect.specialConditions.forEach(sp => {
      target.removeSpecialCondition(sp);
    });
    return state;
  }

  if (effect instanceof EffectOfAttackEffect) {
    effect.applyEffect();
    return state;
  }

  return state;
}


function applyAttackDamage(
  store: StoreLike, state: State, effect: PutDamageEffect, targetCard: PokemonCard, targetOwner: Player, sourceOwner: Player,
): State {
  const { target } = effect;
  const damage = Math.max(0, effect.damage);
  if (effect.attackEffect && target.surviveOnTenHpNextTurn) {
    effect.surviveOnTenHPReason = target.surviveOnTenHpNextTurn;
  }
  if (effect.surviveOnTenHPCoin && !effect.surviveOnTenHPReason && damage > 0) {
    const hp = new CheckHpEffect(targetOwner, target);
    state = store.reduceEffect(state, hp);
    if (target.damage < hp.hp && target.damage + damage >= hp.hp) {
      // Resolve Guts before applying damage. The animation can finish while
      // the attack waits, and Glimwood Tangle applies only to attack flips.
      const coin = new CoinFlipEffect(targetOwner);
      coin.skipAttackReflip = true;
      state = store.reduceEffect(state, coin);
      if (coin.result === true) effect.surviveOnTenHPReason = effect.surviveOnTenHPCoin;
    }
  }
  const damageBefore = target.damage;
  target.damage += damage;
  const retaliation = target.retaliateOnDamageNextTurn;
  const defendingPlayer = targetOwner;
  if (damage > 0 && effect.attackEffect && retaliation
    && (!('coinFlipPrevent' in retaliation) || retaliation.coinFlipPrevent !== true)
    && retaliation.attackerPlayerId === defendingPlayer.id
    && StateUtils.getOpponent(state, defendingPlayer) === effect.player) {
    const retaliationDamage = 'reflect' in retaliation && retaliation.reflect
      ? damage
      : ('damage' in retaliation ? retaliation.damage : 0);
    const retaliatingPlayer = defendingPlayer;
    const revenge = new AttackEffect(retaliatingPlayer, effect.player, retaliation.attack);
    revenge.source = target;
    const counters = new PutCountersEffect(revenge, retaliationDamage);
    counters.target = effect.source;
    if (retaliationDamage > 0) store.reduceEffect(state, counters);
  }
  if (damage > 0 && effect.attackEffect) {
    const hp = new CheckHpEffect(StateUtils.findOwner(state, target), target);
    store.reduceEffect(state, hp);
    if (damageBefore < hp.hp && target.damage >= hp.hp) {
      effect.attackEffect.lethalDamageTargets?.add(targetCard);
      attackEffectKnockOuts.delete(targetCard);
      target.attackDamageKnockOut = {
        attack: effect.attack, sourceCard: effect.source.getPokemonCard(), playerId: effect.player.id,
        turn: state.turn
      };
      attackDamagePositions.set(target.attackDamageKnockOut, {
        active: targetOwner.active === target,
        protectAttacker: effect.attackEffect.protectAttackerOnDamageKnockOut
      });
    }
  }

  if (damage > 0) {
    store.log(state, GameLog.LOG_PLAYER_DEALS_DAMAGE, {
      name: sourceOwner.name,
      damage: damage,
      target: targetCard.name,
      effect: effect.attack.name,
    });

    const targetOwner = StateUtils.findOwner(state, target);
    targetOwner.marker.addMarkerToState(targetOwner.DAMAGE_DEALT_MARKER);

    // Track damage dealt by the attacking Pokemon
    if (effect.attackEffect && effect.source) {
      GameStatsTracker.trackDamageDealt(effect.player, effect.source, damage);
    }

    if (targetCard.damageTakenLastTurn !== undefined) {
      targetCard.damageTakenLastTurn += damage;
    }

    if (effect.surviveOnTenHPReason !== undefined) {
      const checkHpEffect = new CheckHpEffect(targetOwner, target);
      state = store.reduceEffect(state, checkHpEffect);
      if (target.damage >= checkHpEffect.hp) {
        store.log(state, GameLog.LOG_SURVIVES_ON_TEN_HP, {
          pokemon: targetCard.name,
          reason: effect.surviveOnTenHPReason,
        });
        target.damage = checkHpEffect.hp - 10;
        target.attackDamageKnockOut = undefined;
      }
    }

    if (effect.attackEffect.damageKnockOutsToLostZone && target.attackDamageKnockOut
      && StateUtils.findOwner(state, target) === effect.opponent) {
      const hp = new CheckHpEffect(effect.opponent, target);
      store.reduceEffect(state, hp);
      if (damageBefore < hp.hp && target.damage >= hp.hp) {
        target.attackDamageKnockOut.destination = 'lostzone';
        target.attackDamageKnockOut.targetCard = targetCard;
      }
    }

    const afterDamageEffect = new AfterDamageEffect(effect.attackEffect, damage);
    afterDamageEffect.target = effect.target;
    store.reduceEffect(state, afterDamageEffect);
  }

  // --- Track damaged targets for animation ---
  if (effect.attackEffect && effect.attackEffect.player && (effect.attackEffect.player.active as any).pendingAttackTargets) {
    try {
      const cardTarget = getCardTarget(effect.attackEffect.player, state, target);
      const pending = (effect.attackEffect.player.active as any).pendingAttackTargets;
      if (Array.isArray(pending) && !pending.some(t => t.player === cardTarget.player && t.slot === cardTarget.slot && t.index === cardTarget.index)) {
        pending.push(cardTarget);
      }
    } catch (e) { /* ignore if cannot resolve target */ }
  }
  // --- End tracking ---
  return state;
}

function canFlipToPreventDamage(store: StoreLike, state: State, effect: PutDamageEffect, owner: Player): boolean {
  const prevention = effect.damagePreventionCoin;
  if (!prevention || effect.damage <= 0 || effect.ignoresDefendingDamageEffects
    || state.phase !== GamePhase.ATTACK || effect.target.getPokemonCard() !== prevention.source
    || IS_ABILITY_BLOCKED(store, state, owner, prevention.source)) return false;

  const { requiredEnergy } = prevention;
  if (requiredEnergy === undefined) return true;
  const provided = new CheckProvidedEnergyEffect(owner, effect.target);
  store.reduceEffect(state, provided);
  return provided.energyMap.some(entry => entry.provides.includes(requiredEnergy) || entry.provides.includes(CardType.ANY));
}

function recordAttackEffectKnockOut(
  store: StoreLike, state: State, effect: KnockOutOpponentEffect | PutCountersEffect, damageBefore: number
): boolean {
  const { target, player } = effect;
  const card = target.getPokemonCard();
  if (!card || !effect.attackEffect || target.damage <= damageBefore) return false;
  const hp = new CheckHpEffect(StateUtils.findOwner(state, target), target);
  store.reduceEffect(state, hp);
  if (damageBefore >= hp.hp || target.damage < hp.hp) return false;
  target.attackDamageKnockOut = undefined;
  attackEffectKnockOuts.set(card, { playerId: player.id, turn: state.turn });
  return true;
}
