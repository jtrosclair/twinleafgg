import { applyClientCardMetadata, ensureClientCards } from './cards';
import { CARD_IMAGE_ORIGIN, CARD_LIBRARY_SCHEMA_VERSION, CardLibraryMetadata,
  compactCardImageReference, expandCardImageReference, isCardImageReference, isCardLibraryMetadata } from './card-metadata';

describe('ordered executable-card image metadata', () => {
  const identity = { hash: 'a'.repeat(64), catalogueHash: 'b'.repeat(64), cardsTotal: 3 };
  const metadata = (): CardLibraryMetadata => ({ schemaVersion: CARD_LIBRARY_SCHEMA_VERSION,
    hash: identity.hash, catalogueHash: identity.catalogueHash,
    images: ['/tpci/CRZ/CRZ_GG23_R_EN.png', 'assets/cardback.png', ''] });

  it('roundtrips exact scan URLs and preserves non-Limitless and empty values', () => {
    const urls = [CARD_IMAGE_ORIGIN + '/tpci/CRZ/CRZ_GG23_R_EN.png',
      CARD_IMAGE_ORIGIN + '/tpc/SV/SV_001_R_JP.png', 'https://images.pokemontcg.io/base1/4.png',
      'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com.example/tpci/image.png',
      'assets/cardback.png', 'data:image/png;base64,AA==', ''];
    for (const url of urls) {
      expect(expandCardImageReference(compactCardImageReference(url))).toBe(url);
    }
    expect(compactCardImageReference(urls[0])).toBe('/tpci/CRZ/CRZ_GG23_R_EN.png');
    expect(compactCardImageReference(urls[1])).toBe('/tpc/SV/SV_001_R_JP.png');
  });

  it('rejects malformed compact origins and non-string entries', () => {
    for (const entry of [null, undefined, 42, {}, '//example.com/a.png', '/assets/cardback.png',
      '/tpci/', '/tpci/a\\b.png', '/tpci/a.png?replace=1', '/tpc/a\n.png']) {
      expect(isCardImageReference(entry)).toBe(false);
    }
    expect(() => expandCardImageReference('//example.com/a.png')).toThrow();
  });

  it('requires the matching build signatures, schema, exact count, and every array slot', () => {
    expect(isCardLibraryMetadata(metadata(), identity)).toBe(true);
    for (const changes of [{ schemaVersion: 2 }, { hash: 'c'.repeat(64) },
      { catalogueHash: 'd'.repeat(64) }, { images: ['', ''] }, { images: ['', '', null] },
      { images: new Array(3) }]) {
      expect(isCardLibraryMetadata({ ...metadata(), ...changes }, identity)).toBe(false);
    }
    expect(isCardLibraryMetadata(metadata(), { ...identity, catalogueHash: 'not-a-sha256' })).toBe(false);
    expect(isCardLibraryMetadata(metadata(), { ...identity, cardsTotal: 0 })).toBe(false);
  });

  it('applies in registration order without replacing executable cards or methods', () => {
    const cards = ensureClientCards();
    const originals = cards.map(card => card.cardImage);
    const references = [...cards];
    const methods = cards.map(card => card.reduceEffect);
    const expected = { ...identity, cardsTotal: cards.length };
    const data = { ...metadata(), images: cards.map((card, index) => index === 0
      ? '/tpci/TEST/FIRST.png' : index === cards.length - 1 ? '' : card.cardImage) };
    try {
      applyClientCardMetadata(data, expected);
      expect(cards[0].cardImage).toBe(CARD_IMAGE_ORIGIN + '/tpci/TEST/FIRST.png');
      expect(cards[cards.length - 1].cardImage).toBe('');
      for (let index = 0; index < cards.length; index++) {
        expect(cards[index]).toBe(references[index]);
        expect(cards[index].reduceEffect).toBe(methods[index]);
      }
    } finally {
      cards.forEach((card, index) => card.cardImage = originals[index]);
    }
  });

  it('validates the whole table before changing any card image', () => {
    const cards = ensureClientCards();
    const originals = cards.map(card => card.cardImage);
    const expected = { ...identity, cardsTotal: cards.length };
    const images = [...originals];
    images[0] = 'https://images.example/changed.png';
    images[images.length - 1] = '//wrong-origin/image.png';
    expect(() => applyClientCardMetadata({ ...metadata(), images }, expected)).toThrow();
    expect(cards.map(card => card.cardImage)).toEqual(originals);
    expect(() => applyClientCardMetadata({ ...metadata(), images: originals },
      { ...expected, cardsTotal: cards.length + 1 })).toThrow();
    expect(cards.map(card => card.cardImage)).toEqual(originals);
  });
});
