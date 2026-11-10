import { searchBasicsToBench } from '../../game/store/prefabs/search-basic-to-bench';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class Kricketot extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType = G;
  public weakness = [{ type: R, value: +10 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Call for Family',
    cost: [C],
    damage: 0,
    text: 'Search your deck for a Basic Pokémon and put it onto your Bench. Shuffle your deck afterward.'
  },
{
    name: 'Sling',
    cost: [G],
    damage: 10,
    text: ''
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '86';
  public name: string = 'Kricketot';
  public fullName: string = 'Kricketot MT';

  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    // Ref: game/store/prefabs/search-basic-to-bench.ts (private search and public Bench placement).
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state, effect, (store, next) => searchBasicsToBench(store, next, effect, 1));
    return state;
  }
}
