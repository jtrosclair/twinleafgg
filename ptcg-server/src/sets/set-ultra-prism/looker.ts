import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';

export class Looker extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public text: string = 'Draw 3 cards from the bottom of your deck.';

  public set: string = 'UPR';
  public setNumber: string = '126';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Looker';
  public fullName: string = 'Looker UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      effect.preventDefault = true;

      // Draw 3 cards from the bottom of the deck
      const count = Math.min(3, player.deck.cards.length);
      const bottomCards = player.deck.cards.slice(-count);
      player.deck.moveCardsTo(bottomCards, player.hand);

      player.supporter.moveCardTo(effect.trainerCard, player.discard);
    }

    return state;
  }
}