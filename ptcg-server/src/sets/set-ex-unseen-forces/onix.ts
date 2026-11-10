import { EnergyCard, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { RECOVER_DISCARD_BY_ATTACK } from '../../game/store/prefabs/recover-discard-attack';

export class Onix extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 80;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Dig Deep',
      cost: [C],
      damage: 0,
      text: 'Search your discard pile for an Energy card, show it to your opponent, and put it into your hand.'
    },
    {
      name: 'Mud Slap',
      cost: [C, C],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'UF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '65';
  public name: string = 'Onix';
  public fullName: string = 'Onix UF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return RECOVER_DISCARD_BY_ATTACK(store, state, effect, card => card instanceof EnergyCard, 1, false);
    }

    return state;
  }
}
