import { Card, CardList, GameError, GameMessage, OrderCardsPrompt, SelectOptionPrompt } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { MOVE_CARDS, SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND } from '../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';

export class PuzzleOfTime extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'BKP';
  public name: string = 'Puzzle of Time';
  public fullName: string = 'Puzzle of Time BKP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '109';

  public text: string =
    'You may play 2 Puzzle of Time cards at once.\n\n' +
    '• If you played 1 card, look at the top 3 cards of your deck and put them back in any order.\n' +
    '• If you played 2 cards, put 2 cards from your discard pile into your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!WAS_TRAINER_USED(effect, this)) return state;

    const { player } = effect;
    const second = player.hand.cards.find(card => card !== this && card.name === this.name);
    const canOrder = player.deck.cards.length > 0;
    const recoverCount = Math.min(player.discard.cards.length, 2);
    const canRecover = !!second && recoverCount > 0;

    const orderDeck = () => {
      const deckTop = new CardList();
      player.deck.moveTo(deckTop, 3);
      return store.prompt(state, new OrderCardsPrompt(
        player.id, GameMessage.CHOOSE_CARDS_ORDER, deckTop, { allowCancel: false }
      ), order => {
        deckTop.applyOrder(order);
        deckTop.moveToTopOfDestination(player.deck);
      });
    };
    const recover = (companion: Card) => {
      // Both Items stay out of the discard pile until the recovery resolves.
      MOVE_CARDS(store, state, player.hand, player.supporter, { cards: [companion], sourceCard: this });
      SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(store, state, player, this, {}, {
        min: recoverCount, max: recoverCount, allowCancel: false
      }, effect);
      return store.waitPrompt(state, () => {
        MOVE_CARDS(store, state, player.supporter, player.discard, { cards: [companion], sourceCard: this });
      });
    };

    if (canOrder && canRecover) {
      return store.prompt(state, new SelectOptionPrompt(player.id, GameMessage.CHOOSE_OPTION, [
        'play 1 card, look at the top 3 cards of your deck and put them back in any order.',
        'play 2 cards, put 2 cards from your discard pile into your hand.'
      ], { allowCancel: false, defaultValue: 0 }), choice => {
        if (choice === 0) orderDeck();
        else recover(second);
      });
    }
    if (canRecover) return recover(second);
    if (canOrder) return orderDeck();
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }
}
