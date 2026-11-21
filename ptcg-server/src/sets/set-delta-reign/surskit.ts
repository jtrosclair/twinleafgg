import { CardType, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { searchBasicsToBench } from '../../game/store/prefabs/search-basic-to-bench';

export class Surskit extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 50;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Multiply',
    cost: [C],
    damage: 0,
    text: 'Search your deck for up to 2 Surskit and put them onto your Bench. Then, shuffle your deck.'
  },
  {
    name: 'Bug Bite',
    cost: [G],
    damage: 10,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = 'DLR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '2';
  public name: string = 'Surskit';
  public fullName: string = 'Surskit M6';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Multiply
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return searchBasicsToBench(store, state, effect, 2, ['Surskit']);
    }

    return state;
  }
}
