import { GameMessage, ShuffleDeckPrompt, ShowCardsPrompt, ConfirmPrompt } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class PeekingRedCard extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'CIN';

  public name: string = 'Peeking Red Card';

  public fullName: string = 'Peeking Red Card CIN';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '97';

  public text: string =
    'Your opponent reveals their hand. You may have your opponent count the cards in their hand, shuffle those cards into their deck, then draw that many cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const opponentHand = opponent.hand.cards.slice();
      const cardCount = opponentHand.length;

      // Reveal opponent's hand to the player
      store.prompt(state, new ShowCardsPrompt(
        player.id,
        GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
        opponentHand
      ), () => { });

      // Ask if the player wants to shuffle opponent's hand
      state = store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_SHUFFLE_OPPONENTS_CARDS,
      ), wantToUse => {
        if (wantToUse && cardCount > 0) {
          opponent.hand.moveCardsTo(opponentHand, opponent.deck);

          state = store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
            opponent.deck.applyOrder(order);
          });

          opponent.deck.moveTo(opponent.hand, Math.min(cardCount, opponent.deck.cards.length));
        }
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
      });
    }

    return state;
  }

}
