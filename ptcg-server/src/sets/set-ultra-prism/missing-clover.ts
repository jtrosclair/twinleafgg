import { GameError, GameMessage, ShowCardsPrompt } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TAKE_X_PRIZES } from '../../game/store/prefabs/prefabs';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  // Check deck is not empty
  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // Count how many Missing Clover cards are being played
  const missingCloverCards = player.hand.cards.filter(c => c.name === 'Missing Clover');
  const count = missingCloverCards.length;

  // Move the cards from hand to supporter
  player.hand.moveCardTo(effect.trainerCard, player.supporter);
  effect.preventDefault = true;

  // If playing 1 card, look at the top card of your deck
  if (count === 1) {
    const topCard = player.deck.cards[0];

    yield store.prompt(state, new ShowCardsPrompt(
      player.id,
      GameMessage.CARDS_SHOWED_BY_EFFECT,
      [topCard]
    ), () => {
      player.supporter.moveCardTo(effect.trainerCard, player.discard);
      next();
    });
  }
  // If playing 4 cards, take a Prize card
  else if (count === 4) {
    // Move the other 3 Missing Clover cards from hand to supporter, then discard all 4
    const otherCloverCards = missingCloverCards.filter(c => c !== effect.trainerCard);
    for (const card of otherCloverCards) {
      player.hand.moveCardTo(card, player.supporter);
    }

    // Check if player has prizes to take
    if (player.prizes.length === 0) {
      // Discard all the cards
      const allCloverCards = player.supporter.cards.filter(c => c.name === 'Missing Clover');
      for (const card of allCloverCards) {
        player.supporter.moveCardTo(card, player.discard);
      }
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }

    // Take a prize card
    yield TAKE_X_PRIZES(store, state, player, 1, {}, () => {
      // Discard all 4 Missing Clover cards
      const allCloverCards = player.supporter.cards.filter(c => c.name === 'Missing Clover');
      for (const card of allCloverCards) {
        player.supporter.moveCardTo(card, player.discard);
      }
      next();
    });
  } else {
    // If playing 2 or 3 cards, this is not allowed by the card effect
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  return state;
}

export class MissingClover extends TrainerCard {

  public trainerType = TrainerType.ITEM;

  public set: string = 'UPR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '129';

  public name: string = 'Missing Clover';

  public fullName: string = 'Missing Clover UPR';

  public text: string = 'You may play 4 Missing Clover cards at once.\n\n• If you played 1 card, look at the top card of your deck.\n• If you played 4 cards, take a Prize card. (This effect works one time for 4 cards.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }
}
