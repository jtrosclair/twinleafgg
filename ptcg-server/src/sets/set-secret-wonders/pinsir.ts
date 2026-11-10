import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { retreatLockAfterDamage } from '../../game/store/prefabs/retreat-lock-until-target-end-turn';

export class Pinsir extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType = G;
  public weakness = [{ type: R, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Grip and Squeeze',
    cost: [G],
    damage: 20,
    text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  },
  {
    name: 'Power Guillotine',
    cost: [G, C, C],
    damage: 100,
    text: 'Flip 2 coins. If either of them is tails, this attack\'s base damage is 10 instead of 100.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '59';
  public name: string = 'Pinsir';
  public fullName: string = 'Pinsir SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Pinsir.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: set-diamond-and-pearl/staravia.ts (target-owned post-damage retreat lock).
    if (WAS_ATTACK_USED(effect, 0, this)) retreatLockAfterDamage(state, effect);
    // Ref: set-great-encounters/mudkip.ts (coin-gated damage modifier); replace base while preserving bonuses.
    if (WAS_ATTACK_USED(effect, 1, this)) return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
      if (results.some(result => !result)) effect.damage = Math.max(0, effect.damage + 10 - effect.attack.damage);
    });
    return state;
  }
}
