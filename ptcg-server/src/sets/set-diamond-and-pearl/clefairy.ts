import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { afterAttackDamageForOriginalDefender } from '../../game/store/prefabs/post-damage-identity';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { SpecialCondition } from '../../game/store/card/card-types';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Clefairy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType = C;
  public weakness = [{ type: F, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Sing',
    cost: [C],
    damage: 0,
    text: 'The Defending Pokémon is now Asleep.'
  },
  {
    name: 'Moon Impact',
    cost: [C, C],
    damage: 20,
    damageCalculation: '+',
    text: 'If Clefairy is evolved from Cleffa, this attack does 20 damage plus 20 more damage.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '77';
  public name: string = 'Clefairy';
  public fullName: string = 'Clefairy DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      // Ref: set-diamond-and-pearl/hoothoot.ts (condition effect).
      afterAttackDamageForOriginalDefender(state, effect, (postStore, postState, target) => {
        const condition = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
        condition.target = target;
        return postStore.reduceEffect(postState, condition);
      });
    }

    // Ref: set-diamond-and-pearl/seaking.ts (source-dependent bonus).
    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.source.getPokemons().some(p => p.name === 'Cleffa')) {
        effect.damage += 20;
      }
    }

    return state;
  }
}
