import { Card } from '../card/card';
import { CardType, Stage } from '../card/card-types';
import { AttackEffect } from '../effects/game-effects';
import { EffectOfAttackEffect } from '../effects/effect-of-attack-effects';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { COIN_FLIP_PROMPT } from './prefabs';
import { ChooseAttackPrompt } from '../prompts/choose-attack-prompt';
import { GameMessage } from '../../game-message';
import { Attack } from '../card/pokemon-types';
import { PokemonCard } from '../card/pokemon-card';
import { EndTurnEffect } from '../effects/game-phase-effects';
import { PokemonCardList } from '../state/pokemon-card-list';
import { RetaliateOnDamageOptions } from '../state/pokemon-card-list';

import {
  DefendingPokemonTakesDamageOnEnergyAttachFromHandNextTurnEffect,
  RetaliateOnDamageDuringOpponentsNextTurnEffect,
} from '../effects/effect-of-attack-effects';

export function DEFENDING_POKEMON_TAKES_DAMAGE_ON_ENERGY_ATTACH_FROM_HAND_NEXT_TURN(
  store: StoreLike, state: State, effect: AttackEffect, source: Card, damage: number,
): State {
  const delayed = new DefendingPokemonTakesDamageOnEnergyAttachFromHandNextTurnEffect(effect, damage);
  delayed.markerSource = source;
  return store.reduceEffect(state, delayed);
}

export function THIS_POKEMON_RETALIATES_ON_DAMAGE_DURING_OPPONENTS_NEXT_TURN(
  store: StoreLike, state: State, effect: AttackEffect, source: Card,
  options: RetaliateOnDamageOptions,
): State {
  const delayed = new RetaliateOnDamageDuringOpponentsNextTurnEffect(effect, options);
  delayed.markerSource = source;
  return store.reduceEffect(state, delayed);
}

export function FLIP_COIN_TO_PREVENT_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN(
  store: StoreLike, state: State, effect: AttackEffect, source: Card,
): State {
  return COIN_FLIP_PROMPT(store, state, effect.player, result => {
    if (result) {
      PREVENT_DAMAGE(store, state, effect, source);
      PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, source);
    }
  });
}

/** Flip a coin; if heads, prevent damage (but not other effects) next turn. */
export function FLIP_COIN_TO_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN(
  store: StoreLike, state: State, effect: AttackEffect, source: Card,
): State {
  return COIN_FLIP_PROMPT(store, state, effect.player, result => {
    if (result) PREVENT_DAMAGE(store, state, effect, source);
  });
}

export function THIS_POKEMON_TAKES_LESS_DAMAGE_FROM_ATTACKS_DURING_OPPONENTS_NEXT_TURN(
  _store: StoreLike, _state: State, effect: AttackEffect, reduction: number,
): State {
  effect.player.active.damageReductionNextTurn = Math.max(0, reduction);
  return _state;
}

export function THIS_POKEMON_TAKES_LESS_DAMAGE_FROM_ATTACKS_DURING_OPPONENTS_NEXT_TURN_BEFORE_WEAKNESS_AND_RESISTANCE(
  _store: StoreLike, state: State, effect: AttackEffect, reduction: number,
): State {
  effect.player.active.damageReductionBeforeWeaknessNextTurn = Math.max(0, reduction);
  return state;
}

export function OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK(
  store: StoreLike, state: State, effect: AttackEffect, _source: Card,
): State {
  const target = effect.opponent.active.getPokemonCard();
  if (!target || target.attacks.length === 0) return state;
  return store.prompt(state, new ChooseAttackPrompt(effect.player.id,
    GameMessage.CHOOSE_ATTACK_TO_DISABLE, [target], { allowCancel: false }), attack => {
    if (attack) effect.opponent.active.cannotUseAttacksNextTurnPending.push(attack.name);
  });
}

export function DEFENDING_POKEMON_CANNOT_ATTACK(
  _store: StoreLike, state: State, effect: AttackEffect, _source: Card,
): State {
  effect.opponent.active.cannotAttackNextTurnPending = true;
  return state;
}

export function DEFENDING_POKEMON_CANNOT_EVOLVE_NEXT_TURN(
  _store: StoreLike, _state: State, effect: AttackEffect, _source: Card,
): State {
  effect.opponent.active.cannotEvolveNextTurn = true;
  return _state;
}

export function DEFENDING_POKEMON_HAS_NO_ABILITIES_UNTIL_END_OF_YOUR_NEXT_TURN(
  _store: StoreLike, _state: State, effect: AttackEffect, _source: Card,
): State {
  effect.opponent.active.cannotUsePowersNextTurn = true;
  return _state;
}

export function OPPONENTS_POKEMON_CAN_ONLY_USE_THAT_ATTACK(
  store: StoreLike, state: State, effect: AttackEffect, _source: Card,
): State {
  const target = effect.opponent.active.getPokemonCard();
  if (!target || target.attacks.length === 0) return state;
  return store.prompt(state, new ChooseAttackPrompt(effect.player.id,
    GameMessage.CHOOSE_ATTACK_TO_DISABLE, [target], { allowCancel: false }), attack => {
    if (attack) {
      effect.opponent.active.cannotUseAttacksNextTurn = target.attacks
        .filter(candidate => candidate.name !== attack.name)
        .map(candidate => candidate.name);
    }
  });
}

export function OPPONENT_CANNOT_PLAY_SUPPORTER_CARDS(
  _store: StoreLike, _state: State, effect: AttackEffect, _source: Card,
): State {
  effect.opponent.supporterCardsBlockedNextTurn = true;
  return _state;
}

export function THIS_POKEMON_HAS_NO_WEAKNESS_DURING_OPPONENTS_NEXT_TURN(
  _store: StoreLike, _state: State, effect: AttackEffect, _source: Card,
): State {
  effect.player.active.noWeaknessNextTurn = true;
  return _state;
}

/** Arm every attack from this Pokémon for its owner's next turn. */
export function ARM_NEXT_TURN_ATTACK_BONUS_ALL_ATTACKS(
  target: PokemonCardList, _source: Card, bonus: number,
): void {
  target.attackDamageBonusNextTurn = bonus;
  target.attackDamageBonusNextTurnPending = true;
}

/** Add Colorless costs to the Defending Pokémon's attacks for its next turn. */
export function DEFENDING_POKEMON_ATTACKS_COST_MORE(
  _store: StoreLike, state: State, effect: AttackEffect, amount: number,
): State {
  effect.opponent.active.attackCostIncreaseDuringNextTurn = Math.max(0, amount);
  return state;
}

export function OPPONENT_CANNOT_PLAY_TRAINER_CARDS(
  _store: StoreLike, state: State, effect: AttackEffect, _source: Card,
): State {
  effect.opponent.trainerCardsBlockedNextTurn = true;
  return state;
}

export function OPPONENT_CANNOT_PLAY_CARDS(
  _store: StoreLike, state: State, effect: AttackEffect, _source: Card,
  options: { item?: boolean; supporter?: boolean; stadium?: boolean; tool?: boolean; energy?: boolean; specialEnergy?: boolean; pokemon?: boolean },
): State {
  const player = effect.opponent;
  const selected = Object.values(options).some(Boolean);
  if (!selected) player.trainerCardsBlockedNextTurn = true;
  if (options.item) player.marker.addMarker(player.ATTACK_EFFECT_ITEM_LOCK, _source, 'attack', 'player');
  if (options.supporter) player.marker.addMarker(player.ATTACK_EFFECT_SUPPORTER_LOCK, _source, 'attack', 'player');
  if (options.stadium) player.marker.addMarker(player.ATTACK_EFFECT_STADIUM_LOCK, _source, 'attack', 'player');
  if (options.tool) player.marker.addMarker(player.ATTACK_EFFECT_TOOL_LOCK, _source, 'attack', 'player');
  if (options.energy) player.energyCardsBlockedNextTurn = true;
  if (options.specialEnergy) player.marker.addMarker(player.ATTACK_EFFECT_SPECIAL_ENERGY_LOCK, _source, 'attack', 'player');
  return state;
}

/** Prevent attaching Energy from hand to the current Defending Pokémon next turn. */
export function YOUR_OPPONENT_CANNOT_ATTACH_ENERGY_FROM_HAND_TO_DEFENDING_POKEMON(
  _store: StoreLike, state: State, effect: AttackEffect, _source: Card,
): State {
  effect.opponent.active.energyAttachBlockedFromHandNextTurn = true;
  return state;
}

export function COIN_FLIPS_FOR_ATTACK(
  source: PokemonCardList, attackName: string, defaultFlips: number,
): number {
  const override = source.nextTurnCoinFlipCount;
  const card = source.getPokemonCard();
  return override && card && override.attackName === attackName && override.sourceCardName === card.fullName
    ? override.flips : defaultFlips;
}

export function FLIP_COIN_FOR_FLY(
  store: StoreLike, state: State, effect: AttackEffect, source: Card,
): State {
  return COIN_FLIP_PROMPT(store, state, effect.player, heads => {
    if (!heads) { effect.damage = 0; return; }
    PREVENT_DAMAGE(store, state, effect, source);
    PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, source);
  });
}

export function DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK(
  _store: StoreLike, _state: State, effect: AttackEffect, _source: Card, coinFlips = 1,
): State {
  effect.opponent.active.coinFlipCancelAttackNextTurn = Math.max(1, coinFlips);
  return _state;
}

export function THIS_POKEMON_SURVIVES_ON_TEN_HP_DURING_OPPONENTS_NEXT_TURN(
  _store: StoreLike, _state: State, effect: AttackEffect, source: Card,
): State {
  effect.player.active.surviveOnTenHpNextTurnPending = source.name;
  return _state;
}

// Upstream ReduceDamageEffect; separate from the fork's legacy marker-only class.
export class OutgoingDamageReductionEffect extends EffectOfAttackEffect {
  readonly type = 'OUTGOING_DAMAGE_REDUCTION_EFFECT';
  constructor(base: AttackEffect, public reduction: number) { super(base); }
  applyEffect(): void {
    this.opponent.active.attackDamageReductionNextTurn = Math.max(0, this.reduction);
  }
}
export function DEFENDING_POKEMON_DOES_LESS_DAMAGE(
  store: StoreLike, state: State, effect: AttackEffect, source: Card, reduction: number
): State {
  const reduced = new OutgoingDamageReductionEffect(effect, reduction);
  reduced.markerSource = source;
  return store.reduceEffect(state, reduced);
}

// Upstream weakness override effect and duration fields, with fork scalar card types.
export class DefendingPokemonWeaknessIsNowEffect extends EffectOfAttackEffect {
  readonly type = 'DEFENDING_POKEMON_WEAKNESS_IS_NOW_EFFECT';
  constructor(base: AttackEffect, public weaknessType: CardType) { super(base); }
  applyEffect(): void {
    const target = this.opponent.active;
    target.weaknessOverrideType = this.weaknessType;
    target.weaknessOverrideAttackerId = this.player.id;
    target.weaknessOverrideClearArmed = false;
  }
}
export function DEFENDING_POKEMON_WEAKNESS_IS_NOW(
  store: StoreLike, state: State, effect: AttackEffect, source: Card, weaknessType: CardType
): State {
  const modified = new DefendingPokemonWeaknessIsNowEffect(effect, weaknessType);
  modified.markerSource = source;
  return store.reduceEffect(state, modified);
}
export class DefendingPokemonTakesMoreDamageDuringAttackerNextTurnEffect extends EffectOfAttackEffect {
  readonly type: string = 'DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_ATTACKER_NEXT_TURN_EFFECT';

  constructor(base: AttackEffect, public damageBonus: number) {
    super(base);
  }

  applyEffect(): void {
    const target = this.opponent.active;
    const bonusAlreadyActive = target.defendingPokemonExtraDamageNextTurn > 0
      && !target.defendingPokemonExtraDamagePending
      && target.defendingPokemonExtraDamageAttackerId === this.player.id;

    target.defendingPokemonExtraDamageNextTurn = this.damageBonus;
    target.defendingPokemonExtraDamageAttackerId = this.player.id;

    if (bonusAlreadyActive) {
      // Attack effects run before damage. Keep the bonus active for this attack,
      // then re-arm pending afterward so the next trap cycle can begin.
      target.defendingPokemonExtraDamageRearmAfterAttack = true;
      return;
    }

    target.defendingPokemonExtraDamagePending = true;
  }
}

export function DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_YOUR_NEXT_TURN(
  store: StoreLike, state: State, attackEffect: AttackEffect, source: Card, damageBonus: number
): State {
  const effect = new DefendingPokemonTakesMoreDamageDuringAttackerNextTurnEffect(attackEffect, damageBonus);
  effect.markerSource = source;
  return store.reduceEffect(state, effect);
}

// Upstream pending/active self-protection; legacy prefab PREVENT_DAMAGE remains unchanged.
class NextTurnPreventDamageEffect extends EffectOfAttackEffect {
  readonly type = 'NEXT_TURN_PREVENT_DAMAGE_EFFECT';
  constructor(base: AttackEffect, private filter: { sourceStage?: Stage; sourceHasAbility?: boolean } = {}) { super(base); this.target = base.source; }
  applyEffect(): void {
    this.player.active.preventDamageNextTurnPending = true;
    this.player.active.preventDamageNextTurnFilterPending = Object.keys(this.filter).length ? this.filter : undefined;
  }
}
class PreventEffectsOfAttacksEffect extends EffectOfAttackEffect {
  readonly type = 'PREVENT_EFFECTS_OF_ATTACKS_EFFECT';
  constructor(base: AttackEffect) { super(base); this.target = base.source; }
  applyEffect(): void { this.player.active.preventEffectsOfAttacksNextTurnPending = true; }
}
export function PREVENT_DAMAGE(
  store: StoreLike, state: State, effect: AttackEffect, source: Card, filter?: { sourceStage?: Stage; sourceHasAbility?: boolean }
): State {
  const protection = new NextTurnPreventDamageEffect(effect, filter); protection.markerSource = source;
  return store.reduceEffect(state, protection);
}

/** Increase the Defending Pokémon's retreat cost through the end of its owner's next turn. */
export function DEFENDING_POKEMON_RETREAT_COSTS_MORE(
  _store: StoreLike, state: State, effect: AttackEffect, amount: number,
): State {
  const target = effect.opponent.active.getPokemonCard();
  if (target) target.retreatCostIncreaseNextTurn = (target.retreatCostIncreaseNextTurn ?? 0) + amount;
  return state;
}
export function PREVENT_EFFECTS_OF_ATTACKS(store: StoreLike, state: State, effect: AttackEffect, source: Card): State {
  const protection = new PreventEffectsOfAttacksEffect(effect); protection.markerSource = source;
  return store.reduceEffect(state, protection);
}

class CoinFlipCancelTrainerPlayEffect extends EffectOfAttackEffect {
  readonly type = 'COIN_FLIP_CANCEL_TRAINER_PLAY_EFFECT';
  constructor(base: AttackEffect) { super(base); this.target = base.source; }
  applyEffect(): void {
    this.opponent.coinFlipCancelTrainerPlayTurnsRemaining = Math.max(this.opponent.coinFlipCancelTrainerPlayTurnsRemaining, 1);
  }
}
export function OPPONENT_COIN_FLIP_CANCEL_TRAINER_CARDS(
  store: StoreLike, state: State, effect: AttackEffect, source: Card
): State {
  const restriction = new CoinFlipCancelTrainerPlayEffect(effect); restriction.markerSource = source;
  return store.reduceEffect(state, restriction);
}
