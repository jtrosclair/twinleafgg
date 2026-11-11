import { Effect } from './effect';
import { AbstractAttackEffect } from './attack-effects';
import { AttackEffect } from './game-effects';
import { Card } from '../card/card';
import { PokemonCard } from '../card/pokemon-card';
import { MarkerConstants } from '../markers/marker-constants';

/**
 * Base class for effects that are caused by attacks
 * These can be prevented by abilities like Skeledirge's "Unaware"
 */
export abstract class EffectOfAttackEffect extends AbstractAttackEffect implements Effect {
  readonly type: string = 'EFFECT_OF_ATTACK_EFFECT';
  public preventDefault = false;
  public markerSource!: Card;

  constructor(base: AttackEffect) {
    super(base);
  }

  /**
   * Apply the effect to the target
   * Override this in subclasses
   */
  abstract applyEffect(): void;
}

/** Damage counters are placed on the Defending Pokémon when it receives Energy from hand. */
export class DefendingPokemonTakesDamageOnEnergyAttachFromHandNextTurnEffect extends EffectOfAttackEffect {
  readonly type = 'DEFENDING_POKEMON_TAKES_DAMAGE_ON_ENERGY_ATTACH_FROM_HAND_NEXT_TURN_EFFECT';
  constructor(base: AttackEffect, public readonly damage: number) { super(base); }
  applyEffect(): void {
    this.opponent.active.pendingEnergyAttachDamageCounters = {
      damage: this.damage,
      attack: this.attack,
      sourceCard: this.markerSource as PokemonCard,
      attackerPlayerId: this.player.id,
    };
  }
}

/** Arm retaliation when this Pokémon is damaged by an attack next turn. */
export class RetaliateOnDamageDuringOpponentsNextTurnEffect extends EffectOfAttackEffect {
  readonly type = 'RETALIATE_ON_DAMAGE_DURING_OPPONENTS_NEXT_TURN_EFFECT';
  constructor(base: AttackEffect, public readonly damage: number) { super(base); }
  applyEffect(): void {
    this.player.active.retaliateOnDamageNextTurnPending = {
      damage: this.damage,
      attack: this.attack,
      sourceCard: this.markerSource as PokemonCard,
      attackerPlayerId: this.player.id,
    };
  }
}

/**
 * Effect that adds a retreat prevention marker
 */
export class PreventRetreatEffect extends EffectOfAttackEffect {
  readonly type: string = 'PREVENT_RETREAT_EFFECT';

  constructor(base: AttackEffect) {
    super(base);
  }

  applyEffect(): void {
    this.opponent.active.marker.addMarker(MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this.markerSource, 'attack', 'pokemon');
  }
}

/**
 * Effect that adds a damage prevention marker
 */
export class PreventDamageEffect extends EffectOfAttackEffect {
  readonly type: string = 'PREVENT_DAMAGE_EFFECT';

  constructor(base: AttackEffect) {
    super(base);
    // This effect protects the attacking Pokémon; the defender's protection
    // must not prevent an effect applied to the attacker.
    this.target = base.source;
  }

  applyEffect(): void {
    this.player.active.marker.addMarker(MarkerConstants.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this.markerSource, 'attack', 'pokemon');
    // CLEAR marker goes on player.marker — it's a turn-cycle bookkeeping signal, not tied to a specific Pokemon
    this.opponent.marker.addMarker(MarkerConstants.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this.markerSource, 'attack', 'player');
  }
}

/**
 * Effect that adds an attack prevention marker
 */
export class PreventAttackEffect extends EffectOfAttackEffect {
  readonly type: string = 'PREVENT_ATTACK_EFFECT';

  constructor(base: AttackEffect) {
    super(base);
  }

  applyEffect(): void {
    this.opponent.active.marker.addMarker(MarkerConstants.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this.markerSource, 'attack', 'pokemon');
  }
}

/**
 * Effect that adds a damage reduction marker
 */
export class ReduceDamageEffect extends EffectOfAttackEffect {
  readonly type: string = 'REDUCE_DAMAGE_EFFECT';

  constructor(base: AttackEffect) {
    super(base);
  }

  applyEffect(): void {
    this.opponent.active.marker.addMarker(MarkerConstants.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this.markerSource, 'attack', 'pokemon');
  }
}

/**
 * Helper functions for creating common effect-of-attack effects
 */
export function preventRetreatEffect(attackEffect: AttackEffect, source: Card): PreventRetreatEffect {
  const effect = new PreventRetreatEffect(attackEffect);
  effect.markerSource = source;
  return effect;
}

export function preventDamageEffect(attackEffect: AttackEffect, source: Card): PreventDamageEffect {
  const effect = new PreventDamageEffect(attackEffect);
  effect.markerSource = source;
  return effect;
}

export function preventAttackEffect(attackEffect: AttackEffect, source: Card): PreventAttackEffect {
  const effect = new PreventAttackEffect(attackEffect);
  effect.markerSource = source;
  return effect;
}

export function reduceDamageEffect(attackEffect: AttackEffect, source: Card): ReduceDamageEffect {
  const effect = new ReduceDamageEffect(attackEffect);
  effect.markerSource = source;
  return effect;
}
