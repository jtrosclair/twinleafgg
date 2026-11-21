import { GameError, GameMessage, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CoinFlipEffect, TrainerEffect } from '../../game/store/effects/play-card-effects';
import { SWITCH_IN_OPPONENT_BENCHED_POKEMON } from '../../game/store/prefabs/prefabs';

export class PokemonCatcher extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'G';
  public set: string = 'SSH';
  public setNumber: string = '175';
  public name: string = 'Pokémon Catcher';
  public fullName: string = 'Pokemon Catcher SSH';

  public text: string =
    'Flip a coin. If heads, switch 1 of your opponent\'s Benched Pokemon ' +
    'with their Active Pokemon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof TrainerEffect) || effect.trainerCard !== this) return state;
    const { player } = effect;
    const opponent = StateUtils.getOpponent(state, player);
    if (!opponent.bench.some(slot => slot.cards.length > 0)) {
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }

    return store.reduceEffect(state, new CoinFlipEffect(player, heads => {
      if (heads) SWITCH_IN_OPPONENT_BENCHED_POKEMON(store, state, player, { sourceEffect: effect });
    }));
  }
}
