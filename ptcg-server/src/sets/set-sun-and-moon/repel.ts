import { GameError, GameMessage, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';
import { SWITCH_OUT_OPPONENT_ACTIVE_POKEMON, TRAINER_TARGET_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Repel extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'SUM';
  public name: string = 'Repel';
  public fullName: string = 'Repel SUM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '130';
  public text: string = 'Your opponent switches their Active Pokémon with 1 of their Benched Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!WAS_TRAINER_USED(effect, this)) return state;
    const { player } = effect;
    const opponent = StateUtils.getOpponent(state, player);
    if (!opponent.bench.some(slot => !!slot.getPokemonCard())) {
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }

    if (TRAINER_TARGET_BLOCKED(store, state, effect, opponent.active)) return state;
    return SWITCH_OUT_OPPONENT_ACTIVE_POKEMON(store, state, player);
  }
}
