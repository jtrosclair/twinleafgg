import { Card } from '../card/card';
import { EffectOfAttackEffect } from '../effects/effect-of-attack-effects';
import { AttackEffect } from '../effects/game-effects';
import { PokemonCardList } from '../state/pokemon-card-list';
import { State } from '../state/state';
import { afterAttackDamageForOriginalDefender } from './post-damage-identity';

// A distinct marker avoids changing the semantics of legacy retreat locks,
// which use the same generic marker name for different durations.
export const ATTACK_RETREAT_LOCK_UNTIL_TARGET_END_TURN = 'ATTACK_RETREAT_LOCK_UNTIL_TARGET_END_TURN';

class RetreatLockUntilTargetEndTurn extends EffectOfAttackEffect {
  readonly type = 'RETREAT_LOCK_UNTIL_TARGET_END_TURN';

  constructor(base: AttackEffect, target: PokemonCardList, source: Card) {
    super(base);
    this.target = target;
    this.markerSource = source;
  }

  public applyEffect(): void {
    this.target.marker.addMarker(ATTACK_RETREAT_LOCK_UNTIL_TARGET_END_TURN, this.markerSource, 'attack', 'pokemon');
  }
}

/** Lock the original Defending Pokémon through the end of its owner's turn. */
export function retreatLockAfterDamage(state: State, attack: AttackEffect): void {
  const attacker = attack.source.getPokemonCard();
  if (!attacker) return;
  afterAttackDamageForOriginalDefender(state, attack, (store, next, target) =>
    store.reduceEffect(next, new RetreatLockUntilTargetEndTurn(attack, target, attacker)));
}
