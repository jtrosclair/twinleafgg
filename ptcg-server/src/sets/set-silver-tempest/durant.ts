import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SEARCH_DECK_REVEAL_AND_MOVE } from '../../game/store/prefabs/search-reveal-attack';

export class Durant extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 110;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Energy Digging',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Search your deck for up to 2 basic Energy cards, reveal them, and put them into your hand. Then, shuffle your deck.'
    },
    {
      name: 'Bite',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: 50,
      text: ''
    }
  ];

  public regulationMark = 'F';

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '13';

  public name: string = 'Durant';

  public fullName: string = 'Durant SIT';

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
