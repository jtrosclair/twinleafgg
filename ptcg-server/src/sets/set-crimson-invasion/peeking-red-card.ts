import { GameError, GameMessage, ShuffleDeckPrompt, ConfirmPrompt } from '../../game';
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

      const opponentCards = opponent.hand.cards.filter(c => c !== this);
      const cardCount = opponentCards.length;

      // Opponent reveals their hand (automatically happens when we check it)

      state = store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
          if (cardCount === 0 && opponent.deck.cards.length === 0) {
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            return;
          }

          opponent.hand.moveCardsTo(opponentCards, opponent.deck);

          store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
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
