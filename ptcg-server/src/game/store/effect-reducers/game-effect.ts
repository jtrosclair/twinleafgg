import { recordBenchStadiumDeparture } from '../stadium-utils';
import { PlayerType } from '../actions/play-card-action';
import { checkCopiedAttackCost, runDelegatedCopiedAttackGenerator } from '../prefabs/copy-attack-delegation';
import { GameError } from '../../game-error';
import { GameLog, GameMessage } from '../../game-message';
import { BoardEffect, CardTag, CardType, SpecialCondition, Stage, SuperType, TrainerType } from '../card/card-types';
import { EnergyCard } from '../card/energy-card';
import { ALPHA_RECOVERY } from '../card/pokemon-card';
import { TrainerCard } from '../card/trainer-card';
import { PowerType, Resistance, Weakness } from '../card/pokemon-types';
import { ApplyWeaknessEffect, DealDamageEffect } from '../effects/attack-effects';
import {
  AddSpecialConditionsPowerEffect,
  CheckAttackCostEffect,
  CheckRetreatCostEffect,
  CheckPokemonStatsEffect,
  CheckPokemonTypeEffect,
  CheckSpecialConditionRemovalEffect,
  CheckProvidedEnergyEffect
} from '../effects/check-effects';
import { Effect } from '../effects/effect';
import {
  AfterEvolveEffect,
  AfterHealEffect,
  AttackEffect,
  EffectOfAbilityEffect,
  EvolveEffect,
  HealEffect, KnockOutEffect,
  PlaceDamageCountersEffect,
  PowerEffect,
  PutDamageCountersEffect,
  SelfKnockOutEffect,
  TrainerPowerEffect,
  UseAttackEffect,
  UsePowerEffect,
  UseStadiumEffect,
  UseTrainerPowerEffect
} from '../effects/game-effects';
import { AfterAttackEffect, EndTurnEffect } from '../effects/game-phase-effects';
import { CoinFlipPrompt } from '../prompts/coin-flip-prompt';
import { StateUtils } from '../state-utils';
import { MarkerConstants } from '../markers/marker-constants';
import { GamePhase, State } from '../state/state';
import { StoreLike } from '../store-like';
import { MoveCardsEffect, PayHandEnergyAttachmentCostEffect } from '../effects/game-effects';
import { GameStatsTracker } from '../game-stats-tracker';
import { PokemonCardList } from '../state/pokemon-card-list';
import { MOVE_CARDS, COIN_FLIP_PROMPT, IS_TOOL_BLOCKED, WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE } from '../prefabs/prefabs';
import { CardList } from '../state/card-list';
import { Player } from '../state/player';
import { ConfirmPrompt } from '../prompts/confirm-prompt';
import { checkState, scheduleEffectKnockOut } from './check-effect';
import { discardKnockedOutPokemon } from './knock-out';
import { ChooseAttackPrompt } from '../prompts/choose-attack-prompt';
import { Card } from '../card/card';
import { Attack } from '../card/pokemon-types';
import { WaitPrompt } from '../prompts/wait-prompt';
import { offerAttackCoinReflip } from '../prefabs/attack-coin-reflip';
import { isLegacySmokescreenMarker, rollCoin } from '../prefabs/coin-flip-results';
import { getBlockedPokemonPlacements, resolveBenchPlayReactions } from '../prefabs/bench-play-reactions';
import { getWillCoinChoicePlayer, readChosenCoinSide, takeWillCoinChoice } from '../prefabs/will-coin-choice';
import { AfterBenchBasicPokemonEffect, AfterPlayBasicFromHandEffect, CoinFlipEffect, CoinFlipSequenceEffect } from '../effects/play-card-effects';
import { beginAttackDamageScope, cancelAttackDamageScope, finishAttackDamageScope, getAttackPayment, resolveAfterAttack, resolveAfterAttackDamage } from '../prefabs/attack-after-damage';
import { wasActiveWhenDamaged } from '../prefabs/knock-out-effects';
import { recordActiveAbilityLockOrder } from '../state/active-ability-lock-order';
import { clearPokemonTypeReplacements, DARK_ENGAGE_MARKER, getPokemonTypeForTurn } from '../prefabs/temporary-pokemon-type';


function applyWeaknessAndResistance(
  damage: number,
  cardTypes: CardType[],
  additionalCardTypes: CardType[],
  weakness: Weakness[],
  resistance: Resistance[],
  weaknessMultiplier: number,
): number {
  let multiply = 1;
  let modifier = 0;

  const allTypes = [...cardTypes, ...additionalCardTypes];

  for (const item of weakness) {
    if (allTypes.includes(item.type)) {
      if (item.value === undefined) {
        multiply *= weaknessMultiplier;
      } else {
        modifier += item.value;
      }
    }
  }

  for (const item of resistance) {
    if (allTypes.includes(item.type)) {
      modifier += item.value;
    }
  }

  return (damage * multiply) + modifier;
}

function* useAttack(next: Function, store: StoreLike, state: State, effect: UseAttackEffect | AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  //Skip attack on first turn
  if (state.turn === 1 && effect.attack.canUseOnFirstTurn !== true && state.rules.attackFirstTurn == false) {
    throw new GameError(GameMessage.CANNOT_ATTACK_ON_FIRST_TURN);
  }

  const attack = effect.attack;
  const delegateFrom = effect instanceof UseAttackEffect ? effect.delegateFrom : undefined;
  let attackingPokemon = delegateFrom && effect instanceof UseAttackEffect ? effect.source : player.active;

  // Legacy bench selection applies only to normal attacks, not an explicitly delegated copycat.
  if (!delegateFrom) {
    player.bench.forEach(benchSlot => {
      const benchPokemon = benchSlot.getPokemonCard();
      if (benchPokemon && benchPokemon.attacks.some(a => a.name === attack.name && a.useOnBench)) {
        attackingPokemon = benchSlot;
      }
    });
  }

  const sp = attackingPokemon.specialConditions;
  const ignoreStatusConditions = effect instanceof UseAttackEffect && effect.ignoreStatusConditions;
  if ((sp.includes(SpecialCondition.PARALYZED) || sp.includes(SpecialCondition.ASLEEP)) && !ignoreStatusConditions) {
    throw new GameError(GameMessage.BLOCKED_BY_SPECIAL_CONDITION);
  }

  // Check if Pokemon cannot attack next turn
  if (attackingPokemon.cannotAttackNextTurn) {
    throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
  }

  // Check if specific attack cannot be used next turn
  if (attackingPokemon.cannotUseAttacksNextTurn.includes(attack.name)) {
    throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
  }

  // Get the actual PokemonCard for power checks
  const attackingPokemonCard = attackingPokemon.getPokemonCard();
  // Check for barrage on powers (and not blocked)
  let hasBarragePower = false;
  if (attackingPokemonCard) {
    hasBarragePower = attackingPokemonCard.powers.some(
      power => power.barrage
    );
  }

  let checkAttackCost: CheckAttackCostEffect;
  if (effect instanceof UseAttackEffect && effect.delegateFrom) {
    const checked = checkCopiedAttackCost(store, state, player, effect.delegateFrom, attack, attackingPokemonCard, attackingPokemon);
    state = checked.state;
    checkAttackCost = checked.effect;
    if (effect.ignoreEnergyCost) checkAttackCost.cost = [];
  } else {
    checkAttackCost = new CheckAttackCostEffect(player, attack, attackingPokemon);
    state = store.reduceEffect(state, checkAttackCost);
    if (!checkAttackCost.fixedCost && attackingPokemon.attackCostIncreaseDuringNextTurn > 0) {
      checkAttackCost.cost.push(...Array(attackingPokemon.attackCostIncreaseDuringNextTurn).fill(CardType.COLORLESS));
    }
  }

  const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, attackingPokemon);
  state = store.reduceEffect(state, checkProvidedEnergy);

  if (StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, checkAttackCost.cost as CardType[]) === false) {
    throw new GameError(GameMessage.NOT_ENOUGH_ENERGY);
  }

  // A legal attack must pass Smokescreen before its Confusion or card effects.
  // Older snapshots keep one or two flips as markers rather than a slot field.
  const pokemonMarkers = attackingPokemon.marker.markers;
  const legacySingle = [...pokemonMarkers, ...player.marker.markers].filter(
    marker => marker.name === MarkerConstants.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN
      || isLegacySmokescreenMarker(marker)
  ).length;
  const legacyDouble = pokemonMarkers.some(marker => marker.name === MarkerConstants.LEGACY_OCTILLERY_CORNER_STOP);
  const persistentFlips = attackingPokemon.marker.hasMarker(MarkerConstants.OCTAZOOKA_ATTACK_CANCELLATION) ? 1 : 0;
  const flips = attackingPokemon.coinFlipCancelAttackNextTurn + legacySingle + (legacyDouble ? 2 : 0) + persistentFlips;
  let anyTails = false;
  for (let index = 0; index < flips; index++) {
    let heads = false;
    state = COIN_FLIP_PROMPT(store, state, player, result => { heads = result; });
    if (store.hasPrompts()) yield store.waitPrompt(state, () => next());
    if (!heads) anyTails = true;
  }
  if (anyTails) return store.reduceEffect(state, new EndTurnEffect(player));

  if (sp.includes(SpecialCondition.CONFUSED)) {
    let flip = false;

    store.log(state, GameLog.LOG_FLIP_CONFUSION, { name: player.name });
    yield store.prompt(state, new CoinFlipPrompt(
      player.id,
      GameMessage.FLIP_CONFUSION),
      result => {
        flip = result;
        next();
      });

    if (flip === false) {
      store.log(state, GameLog.LOG_HURTS_ITSELF);
      attackingPokemon.damage += attackingPokemon.confusionDamage;
      state = store.reduceEffect(state, new EndTurnEffect(player));
      return state;
    }
  }

  store.log(state, GameLog.LOG_PLAYER_USES_ATTACK, { name: player.name, attack: attack.name });
  state.phase = GamePhase.ATTACK;

  // At the start of the attack, initialize pendingAttackTargets
  //  (attackingPokemon as any).pendingAttackTargets = [];

  const attackEffect = (effect instanceof AttackEffect) ? effect : new AttackEffect(player, opponent, attack);
  attackEffect.source = attackingPokemon;
  const inheritedPayment = effect instanceof UseAttackEffect && effect.ignoreEnergyCost
    ? getAttackPayment(state, player) : undefined;
  const attackDamageScope = beginAttackDamageScope(state, {
    player, source: attackingPokemon, cost: inheritedPayment?.cost ?? checkAttackCost.cost.slice()
  });
  try {
    const copycatCard = attackingPokemon.getPokemonCard();
    if (delegateFrom && copycatCard) {
      state = yield* runDelegatedCopiedAttackGenerator(next, {
        store, state, player, opponent, copycatCard, sourceCard: delegateFrom,
        selectedAttack: attack, sourceSlot: attackingPokemon, skipLog: true,
      });
    } else {
      state = store.reduceEffect(state, attackEffect);
      if (store.hasPrompts()) yield store.waitPrompt(state, () => next());
    }

    // --- Attack Animation Trigger ---
    // Set triggerAttackAnimation on the attacking Pokemon
    attackingPokemon.triggerAttackAnimation = true;

    // Find slot and index for the attackingPokemon
    let slot: string | undefined = undefined;
    let index: number | undefined = undefined;
    if (player.active === attackingPokemon) {
      slot = 'active';
      index = 0;
    } else {
      slot = 'bench';
      index = player.bench.indexOf(attackingPokemon);
    }
    const card = attackingPokemon.getPokemonCard();
    const cardId = card ? card.id : undefined;
    const cardType = card ? card.cardType : undefined;

    // Emit attack animation event
    const game = (store as any).handler;
    if (game && game.core && typeof game.core.emit === 'function') {
      game.core.emit((c: any) => {
        if (typeof c.socket !== 'undefined') {
          c.socket.emit(`game[${game.id}]:attack`, {
            playerId: player.id,
            cardId,
            slot,
            index,
            cardType,
            opponentId: opponent.id
          });
        }
      });
    }

    // Yield a wait prompt for the animation (1 second)
    yield store.prompt(state, new WaitPrompt(player.id, 1000, 'Attack animation'), () => {
      // After wait, clear the animation flag
      attackingPokemon.triggerAttackAnimation = false;
      next();
    });
    // --- End Attack Animation Trigger ---

    if (!delegateFrom) {
      const originalDefender = opponent.active;
      if (attackEffect.damage > 0) {
        const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
        state = store.reduceEffect(state, dealDamage);
      }

      state = yield* resolveAfterAttackDamage(() => next(), store, state, attackEffect);
      state = yield* finishAttackDamageScope(() => next(), store, state, attackDamageScope);

      state = yield* resolveAfterAttack(() => next(), store, state,
        new AfterAttackEffect(effect.player, opponent, attack, originalDefender, attackEffect));
    }

  } finally {
    cancelAttackDamageScope(attackDamageScope);
  }

  if ((attack.barrage || hasBarragePower) && !(effect as any)._barrageUsed) {
    state = checkState(store, state);
    if (store.hasPrompts()) {
      yield store.waitPrompt(state, () => next());
    }
    state = checkState(store, state);
    if (store.hasPrompts()) {
      yield store.waitPrompt(state, () => next());
    }
    let wantToUse: boolean | undefined = undefined;
    yield store.prompt(state, new ConfirmPrompt(
      player.id,
      GameMessage.WANT_TO_USE_ABILITY
    ), result => {
      wantToUse = result;
      next();
    });

    if (wantToUse) {
      // If barrage is from a power, prompt for attack choice
      if (!attack.barrage && hasBarragePower) {
        // Gather all attackable cards: the actual Pokemon and any attached tool with attacks
        const attackableCards: Card[] = [];
        const mainPokemon = attackingPokemon.getPokemonCard();
        if (mainPokemon) {
          attackableCards.push(mainPokemon);
        }
        if (attackingPokemon.tools.length > 0) {
          attackableCards.push(attackingPokemon.tools[0]);
        }
        yield store.prompt(state, new ChooseAttackPrompt(
          player.id,
          GameMessage.CHOOSE_ATTACK_TO_COPY,
          attackableCards,
          { allowCancel: false }
        ), (selectedAttack: Attack | null) => {
          if (selectedAttack) {
            const newEffect = new AttackEffect(player, opponent, selectedAttack);
            (newEffect as any)._barrageUsed = true;
            const generator = useAttack(() => generator.next(), store, state, newEffect);
            state = generator.next().value;
          } else {
            state = store.reduceEffect(state, new EndTurnEffect(player));
          }
          next();
        });
        return state;
      } else {
        // Default: use the same attack again
        const newEffect = new UseAttackEffect(player, attack);
        (newEffect as any)._barrageUsed = true;
        const generator = useAttack(() => generator.next(), store, state, newEffect);
        return generator.next().value;
      }
    }
    return store.reduceEffect(state, new EndTurnEffect(player));
  }

  return store.reduceEffect(state, new EndTurnEffect(player));
}

export function gameReducer(store: StoreLike, state: State, effect: Effect): State {
  if (effect instanceof CheckRetreatCostEffect) {
    effect.applyModifiers();
  }

  if (effect instanceof CheckAttackCostEffect && effect.fixedCost) {
    effect.cost = effect.fixedCost.slice();
  }

  if (effect instanceof EndTurnEffect) {
    effect.player.marker.removeMarker(DARK_ENGAGE_MARKER);
    effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, slot => {
      clearPokemonTypeReplacements(slot);
      if (slot.activeDamageBonusNextTurn?.pending) slot.activeDamageBonusNextTurn.pending = false;
      else slot.activeDamageBonusNextTurn = undefined;
    });
    StateUtils.getOpponent(state, effect.player).forEachPokemon(PlayerType.BOTTOM_PLAYER, slot => {
      slot.marker.removeMarker(MarkerConstants.STRONG_WILLED);
    });
  }

  if (effect instanceof AfterAttackEffect) {
    state.players.forEach(player => player.forEachPokemon(PlayerType.BOTTOM_PLAYER, slot => {
      if (slot.defendingPokemonExtraDamageRearmAfterAttack) {
        slot.defendingPokemonExtraDamageRearmAfterAttack = false;
        slot.defendingPokemonExtraDamagePending = true;
      }
    }));
  }

  if (effect instanceof SelfKnockOutEffect) {
    if (!effect.preventDefault && effect.player.getPokemonInPlay().some(slot => slot.getPokemons().includes(effect.source))) {
      scheduleEffectKnockOut(state, effect.source, effect.options);
    }
    return state;
  }

  if (effect instanceof KnockOutEffect) {
    const card = effect.target.getPokemonCard();
    if (card !== undefined) {

      // Pokemon ex rule
      if (card.tags.includes(CardTag.POKEMON_EX) || card.tags.includes(CardTag.POKEMON_V) || card.tags.includes(CardTag.POKEMON_VSTAR) || card.tags.includes(CardTag.POKEMON_ex) || card.tags.includes(CardTag.POKEMON_GX)) {
        effect.prizeCount += 1;
      }
      if (card.tags.includes(CardTag.POKEMON_SV_MEGA) || card.tags.includes(CardTag.TAG_TEAM) || card.tags.includes(CardTag.DUAL_LEGEND)) {
        effect.prizeCount += 1;
      }

      if (card.tags.includes(CardTag.POKEMON_VMAX) || card.tags.includes(CardTag.POKEMON_VUNION)) {
        effect.prizeCount += 2;
      }

      store.log(state, GameLog.LOG_POKEMON_KO, { name: card.name });

      // Centralized revenge attack detection: if Pokémon was knocked out during opponent's attack
      // effect.player is the owner of the knocked out Pokémon
      const knockedOutOwner = effect.player;
      const attacker = StateUtils.getOpponent(state, knockedOutOwner);

      // Check if knockout occurred during opponent's attack phase and damage was dealt
      // The DAMAGE_DEALT_MARKER is set on the player who received damage (knockedOutOwner)
      if (state.phase === GamePhase.ATTACK &&
        state.players[state.activePlayer] === attacker &&
        knockedOutOwner.marker.hasMarker(knockedOutOwner.DAMAGE_DEALT_MARKER)) {
        knockedOutOwner.marker.addMarkerToState(MarkerConstants.REVENGE_MARKER);
      }

      // These persistent effects belong to the attacking player. Use the
      // recorded defender position in case the attack subsequently switched it.
      if (effect.prizeCount > 0 && !effect.preventPrizes
        && WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE(state, effect) && wasActiveWhenDamaged(effect)) {
        if (attacker.usedAlteredCreation) effect.prizeCount += 1;

        const source = effect.target.attackDamageKnockOut?.sourceCard;
        const briar = attacker.briarPrizeBonus;
        if (briar?.turn === state.turn && source?.tags.includes(CardTag.POKEMON_TERA)) effect.prizeCount += briar.count;
        const anthea = attacker.antheaAndConcordiaPrizeBonus;
        if (anthea?.turn === state.turn
          && (source?.tags.includes(CardTag.NS) || source?.name.startsWith("N's "))) effect.prizeCount += anthea.count;

        if (attacker.starOrderTurn === state.turn && source?.stage === Stage.BASIC
          && source.tags.includes(CardTag.POKEMON_V)
          && card.tags.some(tag => tag === CardTag.POKEMON_VSTAR || tag === CardTag.POKEMON_VMAX)) {
          effect.prizeCount += 1;
        }
      }

      const duringOpponentsTurn = [GamePhase.PLAYER_TURN, GamePhase.ATTACK].includes(state.phase)
        && state.players[state.activePlayer] === attacker;
      if (duringOpponentsTurn) {
        knockedOutOwner.pokemonKnockedOutDuringOpponentsLastTurn = true;
        if (card.tags.includes(CardTag.POKEMON_SV_MEGA) && card.tags.includes(CardTag.POKEMON_ex)) {
          knockedOutOwner.marker.addMarkerToState(MarkerConstants.MEGA_EX_KNOCKED_OUT_DURING_OPPONENTS_LAST_TURN);
        }
        const ko = effect.target.attackDamageKnockOut;
        if (state.phase === GamePhase.ATTACK && ko && ko.turn === state.turn && ko.playerId === attacker.id) {
          knockedOutOwner.pokemonKnockedOutByAttackDuringOpponentsLastTurn = true;
          if (card.tags.includes(CardTag.HOPS)) {
            knockedOutOwner.marker.addMarkerToState(MarkerConstants.HOPS_KNOCKED_OUT_BY_ATTACK_LAST_TURN);
          }
        }
      }

      // Older slots can hold an Energy card only in their secondary list.
      // The normal card fan-out already handled all other attached cards.
      for (const energy of new Set(effect.target.energies.cards)) {
        if (energy instanceof EnergyCard && !effect.target.cards.includes(energy)) {
          state = energy.reduceEffect(store, state, effect);
        }
      }
      if (!effect.resolveBeforeDiscard) {
        state = discardKnockedOutPokemon(store, state, effect);
      }
    }
  }

  if (effect instanceof CheckPokemonTypeEffect) {
    const replacement = getPokemonTypeForTurn(state, effect.target);
    if (replacement !== undefined) effect.cardTypes = [replacement];
  }

  if (effect instanceof ApplyWeaknessEffect) {
    effect.damage = Math.max(0,
      effect.damage - effect.source.attackDamageReductionNextTurn - effect.attackDamageReductionBeforeWeakness);
    if (effect.damage === 0 && effect.attackDamageReductionBeforeWeakness > 0) return state;
    const checkPokemonType = new CheckPokemonTypeEffect(effect.source);
    state = store.reduceEffect(state, checkPokemonType);
    const checkPokemonStats = new CheckPokemonStatsEffect(effect.target);
    state = store.reduceEffect(state, checkPokemonStats);
    if (effect.target.weaknessOverrideType !== undefined) {
      checkPokemonStats.weakness = [{ type: effect.target.weaknessOverrideType }];
    }

    const cardType = checkPokemonType.cardTypes;
    const additionalCardTypes = checkPokemonType.cardTypes;
    const weakness = effect.ignoreWeakness ? [] : checkPokemonStats.weakness;
    const resistance = effect.ignoreResistance ? [] : checkPokemonStats.resistance;
    effect.damage = applyWeaknessAndResistance(effect.damage, cardType, additionalCardTypes,
      weakness, resistance, effect.weaknessMultiplier);
    return state;
  }

  if (effect instanceof UseAttackEffect) {
    const generator = useAttack(() => generator.next(), store, state, effect);
    return generator.next().value;
  }

  if (effect instanceof UsePowerEffect) {
    const player = effect.player;
    const power = effect.power;
    const card = effect.card;

    store.log(state, GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, ability: power.name });
    state = store.reduceEffect(state, new PowerEffect(player, power, card, effect.destination, effect.target.slot));
    return state;
  }

  if (effect instanceof UseTrainerPowerEffect) {
    const player = effect.player;
    const power = effect.power;
    const card = effect.card;

    store.log(state, GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, ability: power.name });
    state = store.reduceEffect(state, new TrainerPowerEffect(player, power, card));
    return state;
  }

  if (effect instanceof AddSpecialConditionsPowerEffect) {
    const target = effect.target;
    effect.specialConditions.forEach(sp => {
      target.addSpecialCondition(sp);
    });
    if (effect.specialConditions.includes(SpecialCondition.POISONED) && effect.poisonDamage !== undefined) {
      target.poisonDamage = effect.poisonDamage;
    }
    if (effect.specialConditions.includes(SpecialCondition.BURNED) && effect.burnDamage !== undefined) {
      target.burnDamage = effect.burnDamage;
    }
    if (effect.specialConditions.includes(SpecialCondition.CONFUSED) && effect.confusionDamage !== undefined) {
      target.confusionDamage = effect.confusionDamage;
    }
    if (effect.specialConditions.includes(SpecialCondition.ASLEEP) && effect.sleepFlips !== undefined) {
      target.sleepFlips = effect.sleepFlips;
    }
    return state;
  }

  if (effect instanceof UseStadiumEffect) {
    const player = effect.player;
    store.log(state, GameLog.LOG_PLAYER_USES_STADIUM, { name: player.name, stadium: effect.stadium.name });
    player.stadiumUsedTurn = state.turn;
  }

  // if (effect instanceof TrainerEffect && effect.trainerCard.trainerType === TrainerType.SUPPORTER) {
  //   const player = effect.player;
  //   store.log(state, GameLog.LOG_PLAYER_PLAYS_SUPPORTER, { name: player.name, stadium: effect.trainerCard.name });
  // }

  if (effect instanceof HealEffect) {
    const pokemon = effect.target.getPokemonCard();
    const hasAlphaRecovery = pokemon?.powers.some(power =>
      power.powerType === PowerType.ANCIENT_TRAIT && power.name === ALPHA_RECOVERY.name);
    const previousDamage = effect.target.damage;
    effect.target.damage = Math.max(0, previousDamage - effect.damage * (hasAlphaRecovery ? 2 : 1));
    if (effect.target.damage < previousDamage) {
      return store.reduceEffect(state, new AfterHealEffect(effect.target, previousDamage - effect.target.damage));
    }
    return state;
  }

  if (effect instanceof PutDamageCountersEffect) {
    // First process the EffectOfAbilityEffect
    state = store.reduceEffect(state, effect.effectOfAbility);

    // Then apply the damage if the effect wasn't prevented
    if (effect.effectOfAbility.target) {
      const damage = Math.max(0, effect.damage);
      effect.effectOfAbility.target.damage += damage;

      if (damage > 0) {
        const targetCard = effect.effectOfAbility.target.getPokemonCard();
        if (targetCard) {
          store.log(state, GameLog.LOG_PLAYER_PLACES_DAMAGE_COUNTERS, {
            name: effect.player.name,
            damage: damage,
            target: targetCard.name,
            effect: effect.power.name,
          });
        }
      }
    }
    return state;
  }

  if (effect instanceof PlaceDamageCountersEffect) {
    if (effect.preventDefault) {
      return state;
    }

    if (effect.source && effect.sourcePower) {
      const ability = new EffectOfAbilityEffect(effect.player, effect.sourcePower, effect.source, effect.target);
      state = store.reduceEffect(state, ability);
      if (ability.preventDefault || !ability.target) {
        effect.preventDefault = true;
        return state;
      }
      effect.target = ability.target;
    }

    const target = effect.target;
    const targetCard = target.getPokemonCard();
    if (targetCard === undefined) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }

    const damage = Math.max(0, effect.damage);
    target.damage += damage;

    if (damage > 0) {
      const effectName = effect.sourcePower?.name ?? effect.source?.name ?? '';
      store.log(state, GameLog.LOG_PLAYER_PLACES_DAMAGE_COUNTERS, {
        name: effect.player.name,
        damage: damage,
        target: targetCard.name,
        effect: effectName,
      });

      // Track damage dealt if source is provided
      if (effect.source) {
        const sourceCardList = StateUtils.findPokemonSlot(state, effect.source);
        if (sourceCardList) {
          GameStatsTracker.trackDamageDealt(effect.player, sourceCardList, damage);
        }
      }
    }
    return state;
  }

  if (effect instanceof EvolveEffect) {
    const pokemonCard = effect.target.getPokemonCard();

    if (pokemonCard === undefined) {
      throw new GameError(GameMessage.INVALID_TARGET);
    }

    // Track Pokemon evolution for damage continuity
    GameStatsTracker.handlePokemonEvolution(
      effect.player,
      effect.target,
      pokemonCard,
      effect.pokemonCard
    );

    store.log(state, GameLog.LOG_PLAYER_EVOLVES_POKEMON, {
      name: effect.player.name,
      pokemon: pokemonCard.name,
      card: effect.pokemonCard.name
    });
    effect.source.moveCardTo(effect.pokemonCard, effect.target);
    if (effect.target === effect.player.active && (pokemonCard.activeAbilityLock || effect.pokemonCard.activeAbilityLock)) {
      recordActiveAbilityLockOrder(state);
    }
    effect.target.pokemonPlayedTurn = state.turn;
    effect.target.marker.markers = [];

    // All successful evolution paths clear Pokémon effects, while Stadiums
    // and other rules may preserve selected Special Conditions.
    const removal = new CheckSpecialConditionRemovalEffect(effect.player, effect.target);
    store.reduceEffect(state, removal);
    effect.target._preservedConditionsDuringEvolution = removal.preservedConditions;
    if (effect.clearPlayerMarkers) effect.player.removePokemonEffects(effect.target);
    else effect.target.clearEffects();
    effect.target._preservedConditionsDuringEvolution = undefined;
    effect.target.triggerEvolutionAnimation = true;
  }

  if (effect instanceof AfterEvolveEffect && effect.pokemonCard.stage === Stage.MEGA) {
    const { player, target, pokemonCard } = effect;
    if (pokemonCard.powers.some(power => power.powerType === PowerType.ANCIENT_TRAIT && power.name === 'θ Max')) {
      state = store.reduceEffect(state, new HealEffect(player, target, target.damage));
    }

    // An attack already has its own turn-end sequence, including prize choices.
    if (state.phase !== GamePhase.PLAYER_TURN || state.players[state.activePlayer] !== player) return state;

    const spiritLink = `${pokemonCard.evolvesFrom.replace(/[- ]EX$/, '')} Spirit Link`;
    const linked = target.tools.some(tool => tool instanceof TrainerCard && tool.trainerType === TrainerType.TOOL
      && tool.name === spiritLink && !IS_TOOL_BLOCKED(store, state, player, tool));
    if (linked) return state;

    const turn = state.turn;
    return store.waitPrompt(state, () => {
      // Finish the current action and its prompts before ending the turn once.
      if (state.turn === turn && state.phase === GamePhase.PLAYER_TURN && state.players[state.activePlayer] === player) {
        store.reduceEffect(state, new EndTurnEffect(player));
      }
    });
  }

  if (effect instanceof MoveCardsEffect) {
    const source = effect.source;
    const destination = effect.destination;
    const stadiumOwner = state.players.find(player => player.stadium === source);
    const previousStadium = stadiumOwner?.stadium.cards[0];
    const benchOwner = destination instanceof PokemonCardList && destination.cards.length === 0
      ? state.players.find(player => (player.hand === source || player.deck === source || player.discard === source)
        && player.bench.includes(destination)) : undefined;
    if (effect instanceof PayHandEnergyAttachmentCostEffect && (source !== effect.player.hand
      || destination !== effect.player.discard || effect.cards?.length !== effect.payment.length
      || !effect.payment.every(card => effect.cards?.includes(card) && source.cards.includes(card)))) {
      effect.preventDefault = true;
      return state;
    }
    if (benchOwner) {
      const candidates = effect.cards ?? source.cards.slice(0, effect.count);
      if (getBlockedPokemonPlacements(store, state, benchOwner, candidates).size > 0) {
        effect.preventDefault = true;
        return state;
      }
    }
    const isPartialMove = effect.cards !== undefined || effect.count !== undefined;

    // Only reset in-play Pokemon state when moving the entire card list, not specific cards.
    if (source instanceof PokemonCardList && !effect.skipCleanup && !isPartialMove) {
      const tools = [...source.tools];
      for (const tool of tools) {
        source.moveCardTo(tool, destination);
      }
      source.clearEffects();
      source.damage = 0;
      source.specialConditions = [];
      source.marker.markers = [];
      source.tools = [];
      source.removeBoardEffect(BoardEffect.ABILITY_USED);
    }

    // Prism Star cards discarded by a move go to their owner's Lost Zone.
    let discardOwner: Player | undefined;
    try {
      const owner = StateUtils.findOwner(state, destination);
      if (owner.discard === destination) discardOwner = owner;
    } catch {
      // A temporary list does not have an owner.
    }

    const moveSelected = (cards: Card[]) => {
      if (discardOwner) {
        if (source === discardOwner.stadium) {
          const returning = cards.filter(card => card.returnsToHandWhenDiscardedAsStadium);
          source.moveCardsTo(returning, discardOwner.hand);
          cards = cards.filter(card => !returning.includes(card));
        }
        const toLostZone = cards.filter(card => card.tags.includes(CardTag.PRISM_STAR));
        const toDiscard = cards.filter(card => !card.tags.includes(CardTag.PRISM_STAR));
        source.moveCardsTo(toLostZone, discardOwner.lostzone);
        return source.moveCardsTo(toDiscard, destination);
      }
      return source.moveCardsTo(cards, destination);
    };

    if (isPartialMove || discardOwner) {
      const selected = effect.cards ?? source.cards.slice(0, effect.count);
      const moved = moveSelected(selected);
      // moveCardsTo appends, which already puts the cards at the bottom.
      if (effect.toTop && !effect.toBottom && moved > 0) {
        const movedCards = destination.cards.splice(-moved);
        destination.cards.unshift(...movedCards);
      }
    } else if (effect.toTop) {
      source.moveToTopOfDestination(destination);
    } else {
      source.moveTo(destination);
    }

    if (stadiumOwner && previousStadium && !source.cards.includes(previousStadium)) {
      recordBenchStadiumDeparture(state, stadiumOwner, previousStadium);
    }

    // If source is a PokemonCardList and we moved all cards, discard remaining attached cards
    const resolvingRescuedKnockOut = effect.sourceEffect instanceof KnockOutEffect
      && effect.sourceEffect.target === source && !!effect.sourceEffect.rescuedPokemon;
    if (source instanceof PokemonCardList && source.getPokemons().length === 0 && !resolvingRescuedKnockOut) {
      const player = StateUtils.findOwner(state, source);
      source.moveTo(player.discard);
    }

    if (benchOwner && destination instanceof PokemonCardList) {
      const card = destination.getPokemonCard();
      if (card?.stage === Stage.BASIC) {
        destination.pokemonPlayedTurn = state.turn;
        const completion = source === benchOwner.hand
          ? new AfterPlayBasicFromHandEffect(benchOwner, card, destination, false)
          : new AfterBenchBasicPokemonEffect(benchOwner, card, destination);
        return resolveBenchPlayReactions(store, state, completion);
      }
    }
    return state;
  }

  if (effect instanceof CoinFlipSequenceEffect) {
    const { player, mode, callback } = effect;
    const flippers = typeof mode === 'object' ? mode : undefined;
    const count = typeof mode === 'object' ? mode.length : mode;
    const flipSequence = (results: boolean[], finished: (results: boolean[]) => void): State => {
      const flip = new CoinFlipEffect(flippers?.[results.length] ?? player, result => {
        results.push(result);
        if (count === 'untilTails' ? result : results.length < count) flipSequence(results, finished);
        else finished(results);
      });
      flip.skipAttackReflip = true;
      return store.reduceEffect(state, flip);
    };
    if (count === 0) {
      callback([]);
      return state;
    }
    return flipSequence([], results => offerAttackCoinReflip(store, state,
      () => callback(results), () => flipSequence([], callback), (flippers ?? [player]).map(flipper => flipper.id)));
  }

  if (effect instanceof CoinFlipEffect) {
    const { player, callback } = effect;
    const flip = (chosen?: boolean): State => {
      const requested = effect.forcedResult === false ? false : (chosen ?? effect.forcedResult);
      const result = rollCoin(store, state, player, requested);
      effect.result = result;

      const game = (store as any).handler;
      if (game && game.core && typeof game.core.emit === 'function') {
        game.core.emit((c: any) => {
          if (typeof c.socket !== 'undefined') {
            c.socket.emit(`game[${game.id}]:coinFlip`, { playerId: player.id, result });
          }
        });
      }

      return store.prompt(state, new WaitPrompt(player.id, 2000, 'Coin flip animation'), () => {
        const message = result ? GameLog.LOG_PLAYER_FLIPS_HEADS : GameLog.LOG_PLAYER_FLIPS_TAILS;
        store.log(state, message, { name: player.name });
        if (!callback) return;
        if (effect.skipAttackReflip) return callback(result);
        offerAttackCoinReflip(store, state, () => callback(result), () => {
          const reflip = new CoinFlipEffect(player, callback);
          reflip.skipAttackReflip = true;
          store.reduceEffect(state, reflip);
        }, [player.id]);
      });
    };

    // Synchronous defensive consumers read result as soon as reduceEffect returns.
    // Their coins belong to the opponent of the turn player.
    if (callback && getWillCoinChoicePlayer(state) === player) {
      return store.prompt(state, takeWillCoinChoice(player), selection => {
        flip(readChosenCoinSide(selection));
      });
    }
    return flip();
  }

  return state;
}
