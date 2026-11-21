import { CoinFlipPrompt, GameError, GameMessage, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { SWITCH_IN_OPPONENT_BENCHED_POKEMON } from '../../game/store/prefabs/prefabs';

export class PokemonReversal extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'UF';
  public name: string = 'Pokémon Reversal';
  public fullName: string = 'Pokemon Reversal UF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '88';
  public text = 'Flip a coin. If heads, choose 1 of your opponent\'s Benched Pokémon and switch it with your opponent\'s Active Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof TrainerEffect) || effect.trainerCard !== this) return state;
    const { player } = effect;
    const opponent = StateUtils.getOpponent(state, player);
    if (!opponent.bench.some(slot => slot.cards.length > 0)) {
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }

    return store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), heads => {
      if (heads) SWITCH_IN_OPPONENT_BENCHED_POKEMON(store, state, player, { sourceEffect: effect });
    });
  }
}
