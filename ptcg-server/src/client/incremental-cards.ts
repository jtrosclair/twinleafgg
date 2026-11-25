import { CardManager } from '../game/cards/card-manager';
import { StateSerializer } from '../game/serializer/state-serializer';
import { Card } from '../game/store/card/card';
import { CardLibraryIdentity, CardLibraryMetadata, expandCardImageReference, isCardLibraryMetadata } from './card-metadata';
import { catalogueBatches, catalogueIdentity, catalogueRows, stageOneEvolutionLinks } from './card-catalogue.generated';
import type { ClientCardPreparation } from './cards';

const ordinalByName = new Map(catalogueRows.map(([name], ordinal) => [name, ordinal]));
const loadedBatches = new Map<number, readonly Card[]>();
let publishedOrdinals = new Set<number>();
let preparationQueue = Promise.resolve();
let metadata: CardLibraryMetadata | undefined;
let imagesApplied = new WeakSet<Card>();
CardManager.getInstance().setStageOneEvolutionLinks(stageOneEvolutionLinks);

export function clientCardCatalogueOrdinal(fullName: string): number | undefined {
  return ordinalByName.get(fullName);
}

export function ensureClientCards(): Card[] {
  return CardManager.getInstance().getAllCards();
}

async function prepare(names: readonly string[] | undefined): Promise<ClientCardPreparation> {
  let fallbackReason = names === undefined ? 'full-catalogue-requested' : undefined;
  const requested = new Set<number>();
  for (const name of names || []) {
    const ordinal = ordinalByName.get(name) ?? ordinalByName.get(name.replace('�', 'é'));
    if (ordinal === undefined) {
      fallbackReason = 'legacy-or-unknown-card';
      break;
    }
    requested.add(ordinal);
    if (catalogueRows[ordinal][3]) fallbackReason = 'catalogue-wide-card-rule';
  }

  const nextOrdinals = fallbackReason === undefined
    ? new Set([...publishedOrdinals, ...requested])
    : new Set(catalogueRows.map((_row, ordinal) => ordinal));
  const neededBatches = new Set([...nextOrdinals].map(ordinal => catalogueRows[ordinal][1]));
  const missing = [...neededBatches].filter(batch => !loadedBatches.has(batch));
  const results = await Promise.all(missing.map(batch => catalogueBatches[batch].load().then(
    cards => { loadedBatches.set(batch, cards); },
    error => ({ error })
  )));
  const failed = results.find(result => result !== undefined);
  if (failed) throw failed.error;

  if (nextOrdinals.size !== publishedOrdinals.size) {
    const cards = [...nextOrdinals].sort((a, b) => a - b).map(ordinal => {
      const [name, batch, offset] = catalogueRows[ordinal];
      const card = loadedBatches.get(batch)?.[offset];
      if (!card || card.fullName !== name) {
        throw new Error(`Executable card catalogue mismatch at ${name} in ${catalogueBatches[batch].name}.`);
      }
      return card;
    });
    const manager = CardManager.getInstance();
    const previousCards = manager.getAllCards();
    manager.replaceDefinedCards(cards);
    try {
      StateSerializer.setKnownCards(cards);
    } catch (error) {
      manager.replaceDefinedCards(previousCards);
      throw error;
    }
    publishedOrdinals = nextOrdinals;
  }
  return { loadedCardCount: publishedOrdinals.size, newBatches: missing.length, cachedBatches: loadedBatches.size,
    fullFallback: fallbackReason !== undefined, fallbackReason };
}

function enqueue(names?: readonly string[]): Promise<ClientCardPreparation> {
  const task = preparationQueue.then(() => prepare(names));
  preparationQueue = task.then(() => undefined, () => undefined);
  return task;
}

export function prepareClientCards(names: readonly string[]): Promise<ClientCardPreparation> {
  return enqueue([...names]);
}

export function prepareFullClientCards(): Promise<ClientCardPreparation> {
  return enqueue();
}

/** Artwork belongs to the published canonical ordinal, never to lazy load order. */
export function applyClientCardMetadata(nextMetadata: CardLibraryMetadata, expected: CardLibraryIdentity): void {
  if (expected.catalogueHash !== catalogueIdentity.catalogueHash
    || expected.cardsTotal !== catalogueIdentity.cardsTotal || nextMetadata?.hash !== expected.hash
    || (nextMetadata !== metadata && !isCardLibraryMetadata(nextMetadata, expected))) {
    throw new Error('The card image table does not match the executable card catalogue.');
  }
  if (nextMetadata !== metadata) {
    metadata = nextMetadata;
    imagesApplied = new WeakSet();
  }
  for (const card of ensureClientCards()) {
    if (imagesApplied.has(card)) continue;
    const ordinal = clientCardCatalogueOrdinal(card.fullName);
    if (ordinal === undefined) throw new Error(`Card image ordinal missing for ${card.fullName}.`);
    card.cardImage = expandCardImageReference(nextMetadata.images[ordinal]);
    imagesApplied.add(card);
  }
}
