import { FLIP_COIN_TO_APPLY_ATTACK_CONDITION } from '../../game/store/prefabs/attack-effects';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Rotom extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 80;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Thunder Shock',
    cost: [L, C],
    damage: 50,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
  }];

  public regulationMark = 'J';
  public set: string = 'DLR';
  public setNumber: string = '34';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Rotom';
  public fullName: string = 'Rotom MEE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Thunder Shock
    if (WAS_ATTACK_USED(effect, 0, this)) {
      FLIP_COIN_TO_APPLY_ATTACK_CONDITION(state, effect, SpecialCondition.PARALYZED);
    }

    return state;
  }
}
