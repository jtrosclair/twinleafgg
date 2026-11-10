import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { conditionAfterDamage } from '../set-great-encounters/ge-attack-effects';

export class Magmar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = R;
  public weakness = [{ type: W, value: 20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Fire Punch',
    cost: [C],
    damage: 10,
    text: ''
  },
{
    name: 'Smog',
    cost: [R, C],
    damage: 20,
    text: 'The Defending Pokémon is now Poisoned.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '93';
  public name: string = 'Magmar';
  public fullName: string = 'Magmar SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-great-encounters/drowzee.ts (post-damage condition on the original defender).
    if (WAS_ATTACK_USED(effect, 1, this)) conditionAfterDamage(state, effect, SpecialCondition.POISONED);
    return state;
  }
}
