import { ADD_SLEEP_TO_PLAYER_ACTIVE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Musharna extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Munna';
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Hypnotic Ray',
      cost: [P],
      damage: 20,
      text: 'The Defending Pokémon is now Asleep.'
    },
    {
      name: 'Dream Eater',
      cost: [P, P],
      damage: 90,
      text: 'If the Defending Pokémon is not Asleep, this attack does nothing.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '49';
  public name: string = 'Musharna';
  public fullName: string = 'Musharna BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, effect);
    }

    // Ref: set-diamond-and-pearl/haunter.ts (Dream Eater)
    if (WAS_ATTACK_USED(effect, 1, this) && !effect.opponent.active.specialConditions.includes(SpecialCondition.ASLEEP)) {
      effect.damage = 0;
    }

    return state;
  }
}
