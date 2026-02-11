import { Card } from '../../game/store/card/card';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { CardList } from '../../game/store/state/card-list';
import { OrderCardsPrompt } from '../../game/store/prompts/order-cards-prompt';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const name = effect.trainerCard.name;

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const count = player.hand.cards.reduce((sum, c) => {
    return sum + (c.name === name ? 1 : 0);
  }, 0);
  let playTwoCards = false;

  if (count >= 2) {
    yield store.prompt(state, new ConfirmPrompt(
      player.id,
      GameMessage.WANT_TO_PLAY_BOTH_CARDS_AT_ONCE
    ), result => {
      playTwoCards = result;
      next();
    });
  }

  if (playTwoCards === false) {
    // Play 1 card: Look at the top 3 cards and put them back in any order
    const deckTop = new CardList();
    player.deck.moveTo(deckTop, 3);

    player.supporter.moveCardTo(effect.trainerCard, player.discard);

    return store.prompt(state, new OrderCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARDS_ORDER,
      deckTop,
      { allowCancel: false }
    ), order => {
      if (order === null) {
        return state;
      }

      deckTop.applyOrder(order);
      deckTop.moveToTopOfDestination(player.deck);
      return state;
    });
  }

  // Play 2 cards: Put 2 cards from discard pile into hand
  if (player.discard.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // Discard second Puzzle of Time
  const second = player.hand.cards.find(c => {
    return c.name === name && c !== effect.trainerCard;
  });
  if (second !== undefined) {
    player.hand.moveCardTo(second, player.discard);
  }

  player.supporter.moveCardTo(effect.trainerCard, player.discard);

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.discard,
    {},
    { min: 0, max: 2, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  // Move selected cards to hand
  player.discard.moveCardsTo(cards, player.hand);

  return state;
}

export class PuzzleOfTime extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BKP';

  public name: string = 'Puzzle of Time';

  public fullName: string = 'Puzzle of Time BKP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '109';

  public text: string =
    'You may play 2 Puzzle of Time cards at once. ' +
    '' +
    '• If you played 1 card, look at the top 3 cards of your deck and put them back in any order. ' +
    '• If you played 2 cards, put 2 cards from your discard pile into your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
