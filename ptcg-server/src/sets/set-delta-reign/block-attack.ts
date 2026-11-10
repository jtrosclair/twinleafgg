import { Card, State, StoreLike } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EffectOfAttackEffect } from '../../game/store/effects/effect-of-attack-effects';
class BlockDefenderAttack extends EffectOfAttackEffect {
  readonly type = 'DLR_BLOCK_DEFENDER_ATTACK';
  applyEffect(): void { this.opponent.active.cannotAttackNextTurnPending = true; }
}
export function DEFENDING_POKEMON_CANNOT_ATTACK(store: StoreLike, state: State, effect: AttackEffect, source: Card): State {
  const blocked = new BlockDefenderAttack(effect); blocked.markerSource = source;
  return store.reduceEffect(state, blocked);
}
