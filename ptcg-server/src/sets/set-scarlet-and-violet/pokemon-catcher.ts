import { CoinFlipPrompt, Player, GameError, GameMessage, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { SWITCH_IN_OPPONENT_BENCHED_POKEMON } from '../../game/store/prefabs/prefabs';

export class PokemonCatcher extends TrainerCard {

  public regulationMark = 'G';

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '187';

  public name: string = 'Pokémon Catcher';

  public fullName: string = 'Pokemon Catcher SVI';

  public text: string =
    'Flip a coin. If heads, switch 1 of your opponent\'s Benched Pokemon ' +
    'with their Active Pokemon.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const opponent = StateUtils.getOpponent(state, player);
    const hasBench = opponent.bench.some(b => b.cards.length > 0);

    if (!hasBench) {
      return false;
    }
    return true;
  }

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
