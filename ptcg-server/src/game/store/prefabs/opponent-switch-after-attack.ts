import { Card } from '../card/card';
import { EffectOfAttackEffect } from '../effects/effect-of-attack-effects';
import { AttackEffect } from '../effects/game-effects';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { afterAttackDamageForOriginalDefender } from './post-damage-identity';
import { SWITCH_OUT_OPPONENT_ACTIVE_POKEMON } from './prefabs';

class OpponentSwitchAfterAttack extends EffectOfAttackEffect {
  readonly type = 'OPPONENT_SWITCH_AFTER_ATTACK';
  constructor(base: AttackEffect, private store: StoreLike, private state: State) { super(base); }
  applyEffect(): void { SWITCH_OUT_OPPONENT_ACTIVE_POKEMON(this.store, this.state, this.player, { allowCancel: false }); }
}

/** Opponent chooses the replacement; protection applies to the original defender. */
export function opponentSwitchAfterAttack(state: State, effect: AttackEffect, source: Card): void {
  afterAttackDamageForOriginalDefender(state, effect, (store, afterState) => {
    const switched = new OpponentSwitchAfterAttack(effect, store, afterState);
    switched.markerSource = source;
    return store.reduceEffect(afterState, switched);
  });
}
