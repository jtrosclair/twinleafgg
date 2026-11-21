import { ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK, SWITCH_IN_OPPONENT_BENCHED_POKEMON } from '../../game/store/prefabs/prefabs';

import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Munna extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Sleep Inducer',
      cost: [C],
      damage: 0,
      text: 'Switch the Defending Pokémon with 1 of your opponent\'s Benched Pokémon. The new Defending Pokémon is now Asleep.'
    },
    {
      name: 'Hypnotic Ray',
      cost: [P, C, C],
      damage: 30,
      text: 'The Defending Pokémon is now Asleep.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '48';
  public name: string = 'Munna';
  public fullName: string = 'Munna BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (AFTER_ATTACK(effect, 0, this)) {
      return SWITCH_IN_OPPONENT_BENCHED_POKEMON(store, state, effect.player, {
        sourceEffect: effect,
        onSwitched: () => {
          ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, effect);
        },
      });
    }

    if (AFTER_ATTACK(effect, 1, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, effect);
    }

    return state;
  }
}
