import { Card } from '../card/card';
import { Player } from '../state/player';
import { CardList } from '../state/card-list';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { ShuffleDeckPrompt } from '../prompts/shuffle-prompt';
import { MOVE_CARDS } from './prefabs';

/** Shuffle a separate, already-looked-at group, then return it to the deck bottom. */
export function SHUFFLE_CARDS_TO_BOTTOM(store: StoreLike, state: State, player: Player, cards: CardList, sourceCard?: Card, sourceEffect?: any, after?: () => void): State {
  if (cards.cards.length < 2) {
    state = MOVE_CARDS(store, state, cards, player.deck, { sourceCard, sourceEffect });
    if (after) after();
    return state;
  }
  return store.prompt(state, new ShuffleDeckPrompt(player.id, cards.cards.length), order => {
    cards.cards = order.map(index => cards.cards[index]);
    MOVE_CARDS(store, state, cards, player.deck, { sourceCard, sourceEffect });
    if (after) after();
  });
}
