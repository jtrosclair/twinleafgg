import { CardType, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { searchBasicsToBench } from '../../game/store/prefabs/search-basic-to-bench';

export class Electabuzz extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Call for Family',
    cost: [C],
    damage: 0,
    text: 'Search your deck for up to 2 Basic Pokémon and put them onto your Bench. Then, shuffle your deck.'
  },
  {
    name: 'Headbutt',
    cost: [L, L, C],
    damage: 60,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = 'DLR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '30';
  public name: string = 'Electabuzz';
  public fullName: string = 'Electabuzz M6';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Call for Family
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return searchBasicsToBench(store, state, effect, 2);
    }

    return state;
  }
}
