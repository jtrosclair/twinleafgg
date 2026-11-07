import { CardsInfo } from '../interfaces/cards.interface';
import { CARD_LIBRARY_SCHEMA_VERSION } from 'ptcg-server/client';
import { CLIENT_CARD_TOTAL, CLIENT_CATALOGUE_HASH, CLIENT_LIBRARY_HASH } from '../../client-library-version';
import { CardsService } from './cards.service';

/** Validate the complete pinned bootstrap without HTTP or a storage dependency. */
describe('bundled simulator card-library startup', () => {
  let service: CardsService;
  let info: CardsInfo;
  let bundle: any;
  let fetchSpy: jasmine.Spy;
  let openDatabase: jasmine.Spy;
  let previousBundle: PropertyDescriptor | undefined;
  let previousDatabase: PropertyDescriptor | undefined;
  const manifestPath = 'assets/simulator/cards.hash.json';
  const payloadPath = `assets/simulator/cards.${CLIENT_LIBRARY_HASH}.json`;

  function installBundle(): void {
    info = {
      schemaVersion: CARD_LIBRARY_SCHEMA_VERSION,
      hash: CLIENT_LIBRARY_HASH,
      catalogueHash: CLIENT_CATALOGUE_HASH,
      images: Array(CLIENT_CARD_TOTAL).fill('/tpci/SVI/SVI_001_R_EN.png')
    };
    bundle = { urls: {}, json: {
      [manifestPath]: { ok: true, schemaVersion: CARD_LIBRARY_SCHEMA_VERSION,
        hash: CLIENT_LIBRARY_HASH, catalogueHash: CLIENT_CATALOGUE_HASH, cardsTotal: CLIENT_CARD_TOTAL },
      [payloadPath]: { ok: true, cardsInfo: info }
    } };
    Object.defineProperty(globalThis, '__SIMULATOR_STATIC__', { configurable: true, writable: true, value: bundle });
  }

  beforeEach(() => {
    previousBundle = Object.getOwnPropertyDescriptor(globalThis, '__SIMULATOR_STATIC__');
    previousDatabase = Object.getOwnPropertyDescriptor(globalThis, 'indexedDB');
    openDatabase = jasmine.createSpy('open');
    Object.defineProperty(globalThis, 'indexedDB', { configurable: true, value: { open: openDatabase } });
    fetchSpy = spyOn(globalThis, 'fetch').and.callFake(() => { throw new Error('Bundled startup cannot use the network'); });
    installBundle();
    service = new CardsService();
  });

  afterEach(() => {
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(openDatabase).not.toHaveBeenCalled();
    if (previousBundle) { Object.defineProperty(globalThis, '__SIMULATOR_STATIC__', previousBundle); }
    else { delete (globalThis as any).__SIMULATOR_STATIC__; }
    if (previousDatabase) { Object.defineProperty(globalThis, 'indexedDB', previousDatabase); }
    else { delete (globalThis as any).indexedDB; }
  });

  function rejectsEmbedded(): void {
    let failure: Error;
    service.getCardsInfo().subscribe(() => fail('Invalid embedded metadata cannot become ready'), error => failure = error);
    expect(failure).toBeDefined();
    expect(failure!.message).toContain('Reload this page');
  }

  it('synchronously returns the pinned ordered image table without network or storage', () => {
    let returned: CardsInfo;
    service.getCardsInfo().subscribe(value => returned = value);
    expect(returned!).toBe(info);
    expect(returned!.images).toBe(info.images);
    expect(returned!.images.length).toBe(CLIENT_CARD_TOTAL);
  });

  it('validates once and shares the successful result across callers and subscriptions', () => {
    const read = spyOn<any>(service, 'readCardsInfo').and.callThrough();
    const first = service.getCardsInfo(), second = service.getCardsInfo();
    expect(first).toBe(second);
    first.subscribe(value => expect(value).toBe(info));
    second.subscribe(value => expect(value).toBe(info));
    service.getCardsInfo().subscribe(value => expect(value).toBe(info));
    expect(read).toHaveBeenCalledTimes(1);
  });

  it('rejects a missing bootstrap, either missing document, and foreign metadata without a fallback', () => {
    delete (globalThis as any).__SIMULATOR_STATIC__;
    rejectsEmbedded();
    installBundle(); delete bundle.json[payloadPath];
    rejectsEmbedded();
    installBundle(); delete bundle.json[manifestPath];
    rejectsEmbedded();
    installBundle(); bundle.json = { 'assets/simulator/cards.foreign-library.json': { ok: true, cardsInfo: info } };
    rejectsEmbedded();
  });

  it('requires matching schema, image hash and catalogue order identity in both documents', () => {
    for (const field of ['schemaVersion', 'hash', 'catalogueHash']) {
      for (const target of ['manifest', 'payload']) {
        installBundle();
        const document = target === 'manifest' ? bundle.json[manifestPath] : bundle.json[payloadPath].cardsInfo;
        document[field] = field === 'schemaVersion' ? CARD_LIBRARY_SCHEMA_VERSION - 1 : 'another-library';
        rejectsEmbedded();
      }
    }
  });

  it('requires the compiled card count instead of trusting a matching but truncated manifest and payload', () => {
    for (const count of [0, CLIENT_CARD_TOTAL - 1, CLIENT_CARD_TOTAL + 1, 1.5, String(CLIENT_CARD_TOTAL), undefined]) {
      installBundle(); bundle.json[manifestPath].cardsTotal = count;
      rejectsEmbedded();
    }
    installBundle();
    bundle.json[manifestPath].cardsTotal = CLIENT_CARD_TOTAL - 1;
    info.images.pop();
    rejectsEmbedded();
  });

  it('rejects incomplete tables, sparse slots, full-card objects and extra rule data', () => {
    const malformed = [[], null, {}, info.images.slice(1), Array(CLIENT_CARD_TOTAL),
      Array(CLIENT_CARD_TOTAL).fill({ fullName: 'Old TEST', cardImage: 'assets/cardback.png' })];
    for (const images of malformed) {
      installBundle(); bundle.json[payloadPath].cardsInfo = { ...info, images };
      rejectsEmbedded();
    }
    installBundle(); bundle.json[payloadPath].cardsInfo = { ...info, cards: [{ attacks: [] }] };
    rejectsEmbedded();
  });

  it('validates every image reference before exposing the table', () => {
    for (const invalid of [null, 7, undefined, '//outside.example/card.png', '/other/card.png', '/tpci/a?x=1', '/tpc/a\\b', 'bad\u0000url']) {
      installBundle(); (info.images as any[])[CLIENT_CARD_TOTAL - 1] = invalid;
      rejectsEmbedded();
    }
  });

  it('preserves intentional empty entries, repeated scans and custom URLs in their registration order', () => {
    info.images[0] = '';
    info.images[1] = '/tpc/card.png';
    info.images[2] = 'https://custom.example/card.png?lang=jp&size=large';
    info.images[3] = 'assets/cardback.png';
    let returned: CardsInfo;
    service.getCardsInfo().subscribe(value => returned = value);
    expect(returned!).toBe(info);
    expect(returned!.images.slice(0, 5)).toEqual(['', '/tpc/card.png',
      'https://custom.example/card.png?lang=jp&size=large', 'assets/cardback.png', '/tpci/SVI/SVI_001_R_EN.png']);
  });

  it('rejects failed envelopes and allows retry once the bundled data is repaired', () => {
    bundle.json[manifestPath].ok = false;
    rejectsEmbedded();
    bundle.json[manifestPath].ok = true;
    bundle.json[payloadPath].ok = false;
    rejectsEmbedded();
    bundle.json[payloadPath] = null;
    rejectsEmbedded();
    installBundle();
    let returned: CardsInfo;
    service.getCardsInfo().subscribe(value => returned = value);
    expect(returned!).toBe(info);
  });
});
