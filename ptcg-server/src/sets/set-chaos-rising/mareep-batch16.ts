import { FLIP_COIN_TO_APPLY_ATTACK_CONDITION } from '../../game/store/prefabs/attack-effects';
import { CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State } from '../../game';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MareepBatch172 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = L;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Thunder Wave',
    cost: [L, C],
    damage: 20,
    text: "Flip a coin. If heads, your opponent's Active Pokémon is now Paralyzed.",
  }];

  public regulationMark = 'J';

  public set: string = 'CRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '27';
  public name: string = 'Mareep';
  public fullName: string = "Mareep M4 27";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      FLIP_COIN_TO_APPLY_ATTACK_CONDITION(state, effect, SpecialCondition.PARALYZED);
    }
    return state;
  }
}
