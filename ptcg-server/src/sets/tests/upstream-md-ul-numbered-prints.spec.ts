import { ensureClientCards } from '../../client/cards';
import { Card } from '../../game/store/card/card';
import { StateSerializer } from '../../game/serializer/state-serializer';

describe('Majestic Dawn and Unleashed numbered prints', () => {
  let all: Card[];
  beforeAll(() => { all = ensureClientCards().slice(); });
  afterEach(() => StateSerializer.setKnownCards(all));

  for (const reversed of [false, true]) {
    it('resolves distinct Larvitar prints regardless of registration order ' + reversed, () => {
      StateSerializer.setKnownCards(reversed ? all.slice().reverse() : all);
      expect(StateSerializer.normalizeCardName('Larvitar UL 50')).toBe('Larvitar UL');
      expect(StateSerializer.normalizeCardName('Larvitar UL 51')).toBe('Larvitar UL2');
      expect(StateSerializer.normalizeCardName('Larvitar UL 050')).toBe('Larvitar UL');
      expect(StateSerializer.normalizeCardName('Larvitar UL 051')).toBe('Larvitar UL2');
      expect(StateSerializer.normalizeCardName('Aipom MD 51')).toBe('Aipom MD2');
      expect(StateSerializer.normalizeCardName('Pupitar UL 39')).toBe('Pupitar UL2');
      expect(StateSerializer.normalizeCardName('Onix UL 57')).toBe('Onix UL2');
      expect(StateSerializer.hasKnownCard('Larvitar UL')).toBe(true);
      expect(StateSerializer.hasKnownCard('Larvitar UL2')).toBe(true);
    });
  }
  for (const [requested, missing] of [['Larvitar UL 50', '50'], ['Larvitar UL 51', '51'], ['Larvitar UL 050', '50'], ['Larvitar UL 051', '51']]) {
    it('does not silently substitute a different print if ' + requested + ' is absent', () => {
      StateSerializer.setKnownCards(all.filter(c => !(c.set === 'UL' && c.name === 'Larvitar' && c.setNumber === missing)));
      expect(StateSerializer.normalizeCardName(requested)).toBe('');
    });
  }
  it('retains an unrelated known-set normalization and the old unnumbered fallback', () => {
    expect(StateSerializer.normalizeCardName('Charmander BS 46')).toBe('Charmander BS');
    expect(StateSerializer.normalizeCardName('Larvitar UL')).toBeTruthy();
  });
});
