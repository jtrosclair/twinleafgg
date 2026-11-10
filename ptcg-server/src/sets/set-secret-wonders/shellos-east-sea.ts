import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { searchBasicsToBench } from '../../game/store/prefabs/search-basic-to-bench';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class ShellosEastSea extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType = W;
  public weakness = [{ type: L, value: +10 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Shell Hunting',
    cost: [C],
    damage: 0,
    text: 'Search your deck for up to 2 in any combination of Shellos West Sea and Shellos East Sea and put them on your Bench. Shuffle your deck afterward.'
  },
  {
    name: 'Sprinkle Water',
    cost: [W],
    damage: 10,
    text: ''
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '106';
  public name: string = 'Shellos East Sea';
  public fullName: string = 'Shellos East Sea SW';

  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    // Ref: game/store/prefabs/search-basic-to-bench.ts (private search and public Bench play).
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state, effect, (store, next) =>
      searchBasicsToBench(store, next, effect, 2, ['Shellos East Sea', 'Shellos West Sea']));
    return state;
  }
}
