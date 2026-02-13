import { ConfirmPrompt, GameError, GameMessage, ShowCardsPrompt } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TAKE_SPECIFIC_PRIZES } from '../../game/store/prefabs/prefabs';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  // Check deck is not empty
  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // Count how many Missing Clover cards remain in hand
  // (the played card has already been moved to supporter by PlayItemEffect)
  const count = player.hand.cards.filter(c => c.name === 'Missing Clover').length;
  let playAllFour = false;

  // If player has 3 more in hand (4 total), ask if they want to play all 4 at once
  if (count >= 3) {
    yield store.prompt(state, new ConfirmPrompt(
      player.id,
      GameMessage.WANT_TO_PLAY_ALL_CARDS_AT_ONCE
    ), result => {
      playAllFour = result;
      next();
    });
  }

  // Card is already in supporter via PlayItemEffect
  effect.preventDefault = true;

  if (playAllFour) {
    // Move the other 3 Missing Clover cards from hand to supporter
    const otherCloverCards = player.hand.cards.filter(c => c.name === 'Missing Clover').slice(0, 3);
    for (const card of otherCloverCards) {
      player.hand.moveCardTo(card, player.supporter);
    }

    // Check if player has prizes to take
    if (player.prizes.length === 0) {
      const allCloverCards = player.supporter.cards.filter(c => c.name === 'Missing Clover');
      for (const card of allCloverCards) {
        player.supporter.moveCardTo(card, player.discard);
      }
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }

    // Automatically take the first available prize card
    const firstPrize = player.prizes.find(p => p.cards.length > 0);
    if (firstPrize) {
      TAKE_SPECIFIC_PRIZES(store, state, player, [firstPrize]);
    }

    // Discard all 4 Missing Clover cards
    const allCloverCards = player.supporter.cards.filter(c => c.name === 'Missing Clover');
    for (const card of allCloverCards) {
      player.supporter.moveCardTo(card, player.discard);
    }
  } else {
    // Play 1 card: look at the top card of your deck
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
