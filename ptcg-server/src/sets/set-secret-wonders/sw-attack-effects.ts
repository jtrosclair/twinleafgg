import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

/** Apply recoil after outgoing damage to the same physical attacker, including copied attacks. */
export function recoilAfterDamage(state: State, effect: AttackEffect, amount: number, flipForTails = false): void {
  const source = effect.source, attacker = source.getPokemonCard();
  afterAttackDamage(state, effect, (store, nextState) => {
    const apply = (postStore: StoreLike, postState: State) => {
      const inPlay = postState.players.some(player => player.active === source || player.bench.includes(source));
      if (!attacker || !inPlay || source.getPokemonCard() !== attacker) return postState;
      const attack = new AttackEffect(effect.player, effect.opponent, effect.attack);
      attack.source = source; attack.ignoreWeakness = true; attack.ignoreResistance = true;
      const recoil = new DealDamageEffect(attack, amount); recoil.target = source;
      return postStore.reduceEffect(postState, recoil);
    };
    if (!flipForTails) return apply(store, nextState);
    return COIN_FLIP_PROMPT(store, nextState, effect.player, heads => { if (!heads) apply(store, nextState); });
  });
}
