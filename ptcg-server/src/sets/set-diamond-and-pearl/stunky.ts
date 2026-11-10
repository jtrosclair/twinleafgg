import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { afterAttackDamageForOriginalDefender } from '../../game/store/prefabs/post-damage-identity';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { SpecialCondition } from '../../game/store/card/card-types';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Stunky extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType = D;
  public weakness = [{ type: F, value: 10 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Scratch',
    cost: [C],
    damage: 10,
    text: ''
  },
{
    name: 'Severe Gas',
    cost: [D, C],
    damage: 10,
    text: 'The Defending Pokémon is now Poisoned.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '102';
  public name: string = 'Stunky';
  public fullName: string = 'Stunky DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Severe Gas
    if (WAS_ATTACK_USED(effect, 1, this)) {
      // Ref: set-diamond-and-pearl/hoothoot.ts (condition effect).
      afterAttackDamageForOriginalDefender(state, effect, (postStore, postState, target) => {
        const condition = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
        condition.target = target;
        return postStore.reduceEffect(postState, condition);
      });
    }

    return state;
  }
}
