import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { conditionAfterDamage } from '../set-great-encounters/ge-attack-effects';

export class Roselia extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = G;
  public weakness = [{ type: R, value: 10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Sleep Powder',
    cost: [C],
    damage: 0,
    text: 'The Defending Pokémon is now Asleep.'
  },
{
    name: 'Razor Leaf',
    cost: [G],
    damage: 10,
    text: ''
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '62';
  public name: string = 'Roselia';
  public fullName: string = 'Roselia SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-great-encounters/drowzee.ts (post-damage condition on the original defender).
    if (WAS_ATTACK_USED(effect, 0, this)) conditionAfterDamage(state, effect, SpecialCondition.ASLEEP);
    return state;
  }
}
