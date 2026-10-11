import { Card } from '../card/card';
import { CardType } from '../card/card-types';
import { AttackEffect } from '../effects/game-effects';
import { EffectOfAttackEffect } from '../effects/effect-of-attack-effects';
import { State } from '../state/state';
import { StoreLike } from '../store-like';

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
  constructor(base: AttackEffect) { super(base); this.target = base.source; }
  applyEffect(): void { this.player.active.preventDamageNextTurnPending = true; }
}
class PreventEffectsOfAttacksEffect extends EffectOfAttackEffect {
  readonly type = 'PREVENT_EFFECTS_OF_ATTACKS_EFFECT';
  constructor(base: AttackEffect) { super(base); this.target = base.source; }
  applyEffect(): void { this.player.active.preventEffectsOfAttacksNextTurnPending = true; }
}
export function PREVENT_DAMAGE(store: StoreLike, state: State, effect: AttackEffect, source: Card): State {
  const protection = new NextTurnPreventDamageEffect(effect); protection.markerSource = source;
  return store.reduceEffect(state, protection);
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
