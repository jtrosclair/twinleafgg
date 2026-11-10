import { AttackEffect } from '../effects/game-effects';
import { State } from '../state/state';
import { afterAttackDamage } from './attack-after-damage';
import { SWITCH_ACTIVE_WITH_BENCHED } from './prefabs';

/** Switch only the same physical attacker, if it is still Active. */
export function selfSwitchAfterAttack(state: State, effect: AttackEffect): void {
  const player = effect.player, source = effect.source, attacker = source.getPokemonCard();
  afterAttackDamage(state, effect, (store, next) => {
    if (!attacker || player.active !== source || source.getPokemonCard() !== attacker) return next;
    SWITCH_ACTIVE_WITH_BENCHED(store, next, player);
    return next;
  });
}
