import { CardManager } from '../game/cards/card-manager';
import { printContracts } from '../game/cards/print-compatibility';
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
    const batches = Object.keys(sets).sort()
      .map(name => (sets as { [name: string]: unknown })[name])
      .filter(Array.isArray) as Card[][];
    const contractNames = new Set(printContracts.map(contract => contract.fullName));
    const legacyOwners = new Set<string>();
    const optedIn = new Map<string, Card>();
    const preexisting = manager.getAllCards();
    // Inspect before filtering: the ordinary registry deliberately suppresses
    // duplicate fullNames, which would otherwise hide which class lost.
    for (const batch of [preexisting, ...batches]) for (const card of batch) {
      const identity = (card as any).printCompatibilityIdentity;
      if (identity !== undefined && contractNames.has(identity) && identity !== card.fullName) {
        throw new Error(`Mismatched print compatibility identity: ${identity}`);
      }
      const legacyAlias = (card as any).legacyFullName;
      if (legacyAlias !== undefined && contractNames.has(legacyAlias) && legacyAlias !== identity) {
        if (contractNames.has(identity)) throw new Error(`Ambiguous print compatibility alias: ${legacyAlias}`);
        legacyOwners.add(legacyAlias);
      }
      if (!contractNames.has(card.fullName)) continue;
      if (identity === card.fullName) {
        const prior = optedIn.get(identity);
        if (prior && prior !== card && prior.constructor !== card.constructor) {
          throw new Error(`Ambiguous canonical card identity: ${identity}`);
        }
        optedIn.set(identity, card);
      } else {
        legacyOwners.add(card.fullName);
      }
    }
    // A marked card already in a partially preloaded manager cannot safely be
    // replaced while retaining its index. Fail closed instead of changing a
    // legacy saved-state identity; normal simulator startup begins empty.
    for (const card of preexisting) {
      if (legacyOwners.has(card.fullName) && (card as any).printCompatibilityIdentity === card.fullName) {
        throw new Error(`Canonical identity already registered before its legacy owner: ${card.fullName}`);
      }
    }
    for (const batch of batches) {
      const cards = legacyOwners.size === 0
        ? batch.filter(card => !manager.isCardDefined(card.fullName))
        : batch.filter(card => !((card as any).printCompatibilityIdentity === card.fullName
          && legacyOwners.has(card.fullName) && contractNames.has(card.fullName))
          && !manager.isCardDefined(card.fullName));
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
