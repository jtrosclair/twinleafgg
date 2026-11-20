import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SEARCH_DECK_REVEAL_AND_MOVE } from '../../game/store/prefabs/search-reveal-attack';

export class Gimmighoul extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = P;

  public hp: number = 70;

  public weakness = [{ type: D }];

  public resistance = [{ type: F, value: -30 }];

  public retreat = [C, C];

  public attacks = [
    {
      name: 'Minor Errand-Running',
      cost: [C],
      damage: 0,
      text: 'Search your deck for up to 2 Basic Energy cards, reveal them, and put them into your hand. Then, shuffle your deck.'
    },

    {
      name: 'Tackle',
      cost: [C, C, C],
      damage: 50,
      text: ''
    }
  ];

  public regulationMark = 'H';

  public setNumber = '97';

  public set: string = 'SSP';

  public name: string = 'Gimmighoul';

  public fullName: string = 'Gimmighoul SSP';

  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-astral-radiance/cyndaquil.ts (Charge Energy).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return SEARCH_DECK_REVEAL_AND_MOVE(
        store, state, effect, this, { superType: SuperType.ENERGY, energyType: EnergyType.BASIC }, 2
      );
    }

    return state;
  }
}
