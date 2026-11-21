import { searchBasicsToBench } from '../../../game/store/prefabs/search-basic-to-bench';
import { afterAttackDamageForOriginalDefender } from '../../../game/store/prefabs/post-damage-identity';
import { CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Meloetta extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 90;
  public cardType: CardType = P;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Welcoming Song',
    cost: [C],
    damage: 0,
    text: 'Search your deck for up to 3 Basic Pokémon and put them onto your Bench. Then, shuffle your deck.'
  },
  {
    name: 'Perplex',
    cost: [P, C],
    damage: 30,
    text: 'Your opponent\'s Active Pokémon is now Confused.'
  }];

  public regulationMark: string = 'J';
  public set: string = 'M7';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '32';
  public name: string = 'Meloetta';
  public fullName: string = 'Meloetta FLO';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Welcoming Song
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return searchBasicsToBench(store, state, effect, 3);
    }

    // Perplex
    if (WAS_ATTACK_USED(effect, 1, this)) {
      afterAttackDamageForOriginalDefender(state, effect, (store, next) => {
        YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, next, effect);
        return next;
      });
    }

    return state;
  }
}
