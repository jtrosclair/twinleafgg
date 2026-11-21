import { FLIP_COIN_TO_APPLY_ATTACK_CONDITION } from '../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';

export class Oshawott extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Water Pulse',
    cost: [W, C],
    damage: 20,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Asleep.'
  }];

  public set: string = 'BWP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';
  public name: string = 'Oshawott';
  public fullName: string = 'Oshawott BWP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Water Pulse
    if (WAS_ATTACK_USED(effect, 0, this)) {
      FLIP_COIN_TO_APPLY_ATTACK_CONDITION(state, effect, SpecialCondition.ASLEEP);
    }

    return state;
  }
}
