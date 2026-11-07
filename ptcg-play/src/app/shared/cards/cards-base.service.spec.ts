import { CardManager, PokemonCard, StateSerializer } from 'ptcg-server';
import { CardsBaseService } from './cards-base.service';
import { CARD_LIBRARY_SCHEMA_VERSION, ensureClientCards } from 'ptcg-server/client';
import { CLIENT_CATALOGUE_HASH, CLIENT_LIBRARY_HASH } from '../../client-library-version';

// Capture the real library before sibling specs install their tiny adapter
// registries. Ordered metadata deliberately rejects those incomplete fixtures.
const executableCards = [...ensureClientCards()];

class LocalArtPokemon extends PokemonCard {
  name = 'Local Art'; fullName = 'Local Art TEST'; set = 'TEST'; setNumber = '1'; hp = 100;
  cardImage = 'https://images.example/card_EN_XS.png';
}

describe('local simulator card library', () => {
  let service: CardsBaseService;
  let stored: { [key: string]: string };
  let previousStorage: PropertyDescriptor | undefined;
  let previousCards: any[];
  let previousKnownCards: any[];
  let fetchSpy: jasmine.Spy;

  beforeEach(() => {
    stored = {};
    previousStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
      getItem: (key: string) => stored[key] || null,
      setItem: (key: string, value: string) => stored[key] = value
    } });
    fetchSpy = spyOn(globalThis, 'fetch').and.callFake(() => { throw new Error('Card preferences cannot request a server'); });
    previousCards = CardManager.getInstance().getAllCards();
    previousKnownCards = StateSerializer.knownCards;
    CardManager.getInstance().loadCardsInfo({ cards: [...executableCards], hash: CLIENT_LIBRARY_HASH });
    StateSerializer.setKnownCards(executableCards);
  });

  afterEach(() => {
    if (previousStorage) { Object.defineProperty(globalThis, 'localStorage', previousStorage); }
    else { delete (globalThis as any).localStorage; }
    CardManager.getInstance().loadCardsInfo({ cards: previousCards, hash: '' });
    StateSerializer.setKnownCards(previousKnownCards);
  });

  function create(): CardsBaseService {
    return new CardsBaseService({} as any, { resolve: (url: string) => url } as any);
  }

  it('merges downloaded display metadata without replacing executable card classes', () => {
    const cards = ensureClientCards();
    const card = cards.find(item => item.fullName === 'Charmander BS')!;
    const reduce = card.reduceEffect;
    const previousImage = card.cardImage;
    service = create();
    try {
      service.loadCardsInfo({ schemaVersion: CARD_LIBRARY_SCHEMA_VERSION,
        hash: CLIENT_LIBRARY_HASH, catalogueHash: CLIENT_CATALOGUE_HASH,
        images: cards.map(item => item === card ? 'data:image/png;base64,AA==' : item.cardImage) });
      const loaded = service.getCardByName(card.fullName)!;
      expect(loaded).toBe(card);
      expect(loaded instanceof PokemonCard).toBe(true);
      expect(loaded.reduceEffect).toBe(reduce);
      expect((loaded as PokemonCard).hp).toBe(50);
      expect(service.getScanUrl(loaded)).toBe('data:image/png;base64,AA==');
      expect(fetchSpy).not.toHaveBeenCalled();
    } finally { card.cardImage = previousImage; }
  });

  it('reads art, language, and size preferences locally and saves overrides locally', () => {
    stored.cardLanguage = 'FR';
    stored.preferredCardSize = 'LG';
    service = create();
    const card = new LocalArtPokemon();
    expect(service.getScanUrl(card)).toBe('https://images.example/card_FR_LG.png');
    let changed = '';
    service.overridesChanged$.subscribe(key => changed = key);
    service.setCustomImageForCard(card, 'data:image/png;base64,AA==');
    expect(changed).toBe('TEST 1');
    expect(JSON.parse(stored.customCardImages)['TEST 1']).toBe('data:image/png;base64,AA==');
    expect(service.getScanUrl(card)).toBe('data:image/png;base64,AA==');
    service.clearCustomImageForCard(card);
    expect(JSON.parse(stored.customCardImages)['TEST 1']).toBeUndefined();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('keeps the raw artwork identity when the displayed scan is already cached', () => {
    stored.cardLanguage = 'FR';
    stored.preferredCardSize = 'LG';
    service = new CardsBaseService({} as any, { resolve: () => 'data:image/png;base64,CACHED' } as any);
    const card = new LocalArtPokemon();
    expect(service.getRawScanUrl(card)).toBe('https://images.example/card_FR_LG.png');
    expect(service.getScanUrl(card)).toBe('data:image/png;base64,CACHED');
    service.setCustomImageForCard(card, 'https://images.example/override.png');
    expect(service.getRawScanUrl(card)).toBe('https://images.example/override.png');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('sorts the presentation catalogue without changing registration order and refreshes names on reload', () => {
    const cards = ensureClientCards();
    const registrationOrder = [...cards];
    const metadata = { schemaVersion: CARD_LIBRARY_SCHEMA_VERSION,
      hash: CLIENT_LIBRARY_HASH, catalogueHash: CLIENT_CATALOGUE_HASH,
      images: cards.map(card => card.cardImage) };
    service = create();
    service.loadCardsInfo(metadata);
    expect(ensureClientCards()).toEqual(registrationOrder);
    expect(service.getCards()).not.toBe(cards);
    const names = service.getCardNames();
    expect(names).toEqual(service.getCards().map(card => card.fullName));
    expect(names).toBe(service.getCardNames());
    expect(service.getCardByName(cards[0].fullName)).toBe(cards[0]);
    expect(StateSerializer.knownCards).toEqual(service.getCards());
    service.loadCardsInfo(metadata);
    expect(service.getCardNames()).not.toBe(names);
    expect(service.getCardNames()).toEqual(names);
    expect(service.getCardByName(cards[0].fullName)).toBe(cards[0]);
  });

  it('still resolves and overrides art when browser preference storage is blocked', () => {
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, get: () => { throw new Error('Storage unavailable'); } });
    service = create();
    const card = new LocalArtPokemon();
    expect(service.getScanUrl(card)).toBe('https://images.example/card_EN_SM.png');
    expect(() => service.setCustomImageForCard(card, 'data:image/png;base64,AA==')).not.toThrow();
    expect(service.getScanUrl(card)).toBe('data:image/png;base64,AA==');
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
