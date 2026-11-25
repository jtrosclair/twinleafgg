import { CardTag, GameError, GameMessage, Player, State, StoreLike, SuperType, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../game/store/prefabs/prefabs';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';

export class Pokeball extends TrainerCard {
  public tags: string[] = [CardTag.BALL];

  public regulationMark = 'G';

  public trainerType = TrainerType.ITEM;

  public set = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '185';

  public name = 'Poké Ball';

  public fullName: string = 'Poké Ball SVI';

  public text: string = 'Flip a coin. If heads, search your deck for a Pokémon, reveal it, and put it into your hand. Shuffle your deck afterward.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return player.deck.cards.length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      if (!this.canPlay(store, state, player)) throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);

      // Ref: set-destined-rivals/team-rockets-great-ball.ts (private Pokémon search after the coin).
      return store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), heads => {
        if (heads) {
          SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, this, { superType: SuperType.POKEMON },
            { min: 0, max: 1, allowCancel: false }, effect);
        }
      });
    }
    return state;
  }
}
