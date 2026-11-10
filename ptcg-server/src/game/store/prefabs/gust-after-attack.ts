import { Card } from '../card/card';
import { EffectOfAttackEffect } from '../effects/effect-of-attack-effects';
import { AttackEffect } from '../effects/game-effects';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { afterAttackDamageForOriginalDefender } from './post-damage-identity';
import { SWITCH_IN_OPPONENT_BENCHED_POKEMON } from './prefabs';

class GustAfterAttack extends EffectOfAttackEffect {
  readonly type = 'GUST_AFTER_ATTACK';
  constructor(base: AttackEffect, private store: StoreLike, private state: State) { super(base); }
  applyEffect(): void { SWITCH_IN_OPPONENT_BENCHED_POKEMON(this.store, this.state, this.player, { sourceEffect: this.attackEffect }); }
}

/** Attacker selects the replacement; protection is checked on the original defender. */
export function gustAfterAttack(state: State, effect: AttackEffect, source: Card): void {
  afterAttackDamageForOriginalDefender(state, effect, (store, next) => {
    const gust = new GustAfterAttack(effect, store, next); gust.markerSource = source;
    return store.reduceEffect(next, gust);
  });
}
