/** Versioned display-only payload; card rules and text live in executable classes. */
export const CARD_LIBRARY_SCHEMA_VERSION = 3;

export const CARD_IMAGE_ORIGIN = 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com';

/** These build-generated identities pin the executable catalogue and its order. */
export interface CardLibraryIdentity {
  hash: string;
  catalogueHash: string;
  cardsTotal: number;
}

export interface CardLibraryMetadata {
  schemaVersion: number;
  /** Registration order, before the presentation service sorts the catalogue. */
  images: string[];
  hash: string;
  catalogueHash: string;
}

/** Empty URLs are intentional for cards whose scan has not been supplied. */
export function isCardImageReference(value: unknown): value is string {
  return typeof value === 'string' && !/[\u0000-\u001f\u007f]/.test(value)
    && (!value.startsWith('/') || /^\/tpc(?:i)?\/[^\s?#\\]+$/.test(value));
}

export function compactCardImageReference(url: string): string {
  if (url.startsWith(CARD_IMAGE_ORIGIN + '/tpci/') || url.startsWith(CARD_IMAGE_ORIGIN + '/tpc/')) {
    return url.slice(CARD_IMAGE_ORIGIN.length);
  }
  return url;
}

export function expandCardImageReference(reference: string): string {
  if (!isCardImageReference(reference)) {
    throw new Error('Invalid card image reference.');
  }
  return reference.startsWith('/') ? CARD_IMAGE_ORIGIN + reference : reference;
}

export function isCardLibraryMetadata(value: unknown, expected: CardLibraryIdentity): value is CardLibraryMetadata {
  const metadata = value as CardLibraryMetadata | undefined;
  if (!metadata || metadata.schemaVersion !== CARD_LIBRARY_SCHEMA_VERSION
    || !/^[a-f0-9]{64}$/.test(expected.hash) || !/^[a-f0-9]{64}$/.test(expected.catalogueHash)
    || metadata.hash !== expected.hash || metadata.catalogueHash !== expected.catalogueHash
    || !Number.isSafeInteger(expected.cardsTotal) || expected.cardsTotal <= 0
    || !Array.isArray(metadata.images) || metadata.images.length !== expected.cardsTotal) {
    return false;
  }
  // Do not let sparse arrays skip entry validation before the library is mutated.
  for (let index = 0; index < metadata.images.length; index++) {
    if (!isCardImageReference(metadata.images[index])) { return false; }
  }
  return true;
}
