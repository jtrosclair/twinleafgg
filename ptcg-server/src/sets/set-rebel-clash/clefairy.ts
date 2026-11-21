import { ADD_SLEEP_TO_PLAYER_ACTIVE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Clefairy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Shining Fingers',
      cost: [C],
      damage: 0,
      text: 'Your opponent\'s Active Pokémon is now Asleep.'
    },
    {
      name: 'Magical Shot',
      cost: [P],
      damage: 10,
      text: ''
    }
  ];

  public regulationMark: string = 'D';
  public set: string = 'RCL';
  public setNumber: string = '74';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Clefairy';
  public fullName: string = 'Clefairy RCL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-destined-rivals/team-rockets-drowzee.ts (Hypnotic Ray)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, effect);
    }

    return state;
  }
}
