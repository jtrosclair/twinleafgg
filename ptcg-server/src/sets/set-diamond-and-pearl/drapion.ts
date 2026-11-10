import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { afterAttackDamageForOriginalDefender } from '../../game/store/prefabs/post-damage-identity';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { SpecialCondition } from '../../game/store/card/card-types';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';

export class Drapion extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Skorupi';
  public hp: number = 100;
  public cardType: CardType = P;
  public weakness = [{ type: P, value: 20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Stomp',
    cost: [C, C],
    damage: 20,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 20 damage plus 20 more damage.'
  },
{
    name: 'Poison Claws',
    cost: [P, P, C],
    damage: 50,
    text: 'The Defending Pokémon is now Poisoned.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';
  public name: string = 'Drapion';
  public fullName: string = 'Drapion DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-diamond-and-pearl/skorupi.ts (coin-gated bonus).
    // Stomp
    if (WAS_ATTACK_USED(effect, 0, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 20);
    }

    // Poison Claws
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
