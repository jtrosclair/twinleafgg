import { CardManager } from '../game/cards/card-manager';
import { StateSerializer } from '../game/serializer/state-serializer';
import { Card } from '../game/store/card/card';
import * as sets from '../sets';
import { CardLibraryIdentity, CardLibraryMetadata, expandCardImageReference, isCardLibraryMetadata } from './card-metadata';

let initialized = false;

/** The browser needs executable card classes; JSON metadata cannot replace them. */
export function ensureClientCards(): Card[] {
  const manager = CardManager.getInstance();
  if (!initialized) {
    // Native ESM/webpack namespaces enumerate export names in lexical order;
    // CommonJS re-exports otherwise follow the source barrel's insertion order.
    // The image table must use the same registration order in both builds.
    for (const name of Object.keys(sets).sort()) {
      const value = (sets as { [name: string]: unknown })[name];
      if (!Array.isArray(value)) {
        continue;
      }
      const cards = (value as Card[]).filter(card => !manager.isCardDefined(card.fullName));
      manager.defineSet(cards);
    }
    StateSerializer.setKnownCards(manager.getAllCards());
    initialized = true;
  }
  return manager.getAllCards();
}

/** Apply display metadata while retaining engine methods and card identity. */
export function applyClientCardMetadata(metadata: CardLibraryMetadata, expected: CardLibraryIdentity): void {
  const knownCards = ensureClientCards();
  if (!isCardLibraryMetadata(metadata, expected) || knownCards.length !== expected.cardsTotal) {
    throw new Error('The card image table does not match the executable card catalogue.');
  }
  for (let index = 0; index < knownCards.length; index++) {
    knownCards[index].cardImage = expandCardImageReference(metadata.images[index]);
  }
}
