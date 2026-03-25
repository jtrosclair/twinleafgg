import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, ChooseCardsPrompt, CardList, GameError } from '../../game';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { Effect } from '../../game/store/effects/effect';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  const supporterTurn = player.supporterTurn;
  if (supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  // Check if player has other cards in hand besides Dendra
  const otherCards = player.hand.cards.filter(c => c !== effect.trainerCard);
  if (otherCards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const deckBottom = new CardList();

  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARDS_TO_PUT_ON_BOTTOM_OF_THE_DECK,
    player.hand,
    {},
    { min: 1, max: 1, allowCancel: false }
  ), selected => {
    const cards = selected || [];
    player.hand.moveCardsTo(cards, deckBottom);
    next();
  });

  deckBottom.moveTo(player.deck);

  // Draw cards until you have 5 cards in hand
  while (player.hand.cards.length < 5) {
    if (player.deck.cards.length === 0) {
      break;
    }
    player.deck.moveTo(player.hand, 1);
  }

  player.supporter.moveCardTo(effect.trainerCard, player.discard);

  return state;
}

export class Dendra extends TrainerCard {

  public regulationMark = 'G';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '179';

  public name: string = 'Dendra';

  public fullName: string = 'Dendra PAL';

  public text: string =
    'Put a card from your hand on the bottom of your deck. If you do, draw cards until you have 5 cards in your hand. (If you have no other cards in your hand, you can\'t use this card.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
