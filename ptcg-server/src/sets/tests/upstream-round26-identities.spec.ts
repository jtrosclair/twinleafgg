import { ensureClientCards } from '../../client/cards';
import { Card } from '../../game/store/card/card';
import { StateSerializer } from '../../game/serializer/state-serializer';

describe('reviewed numbered identities in round 26', () => {
  let cards: Card[];
  beforeAll(() => { cards = ensureClientCards().slice(); });
  afterEach(() => StateSerializer.setKnownCards(cards));
  for (const reverse of [false, true]) {
    it('resolves the exact new print regardless of registration order: ' + reverse, () => {
      StateSerializer.setKnownCards(reverse ? cards.slice().reverse() : cards);
      expect(StateSerializer.normalizeCardName('Inkay LOR 77')).toBe('Inkay LOR 77');
      expect(StateSerializer.normalizeCardName('Duskull SF 60')).toBe('Duskull SF3');
      expect(StateSerializer.normalizeCardName('Crobat UL 14')).toBe('Crobat UL2');
      expect(StateSerializer.normalizeCardName('Inkay LOR 077')).toBe('Inkay LOR 77');
      expect(StateSerializer.normalizeCardName('Duskull SF 060')).toBe('Duskull SF3');
      expect(StateSerializer.normalizeCardName('Crobat UL 014')).toBe('Crobat UL2');
      expect(StateSerializer.hasKnownCard('Inkay LOR')).toBe(true);
      expect(StateSerializer.hasKnownCard('Duskull SF')).toBe(true);
      expect(StateSerializer.hasKnownCard('Crobat UL')).toBe(true);
    });
  }
  for (const [name, set, number] of [['Inkay', 'LOR', '77'], ['Duskull', 'SF', '60'], ['Crobat', 'UL', '14']]) {
    it('does not substitute an older print if the requested print is absent: ' + name, () => {
      StateSerializer.setKnownCards(cards.filter(c => !(c.name === name && c.set === set && c.setNumber === number)));
      expect(StateSerializer.normalizeCardName(`${name} ${set} ${number}`)).toBe('');
      expect(StateSerializer.normalizeCardName(`${name} ${set} 0${number}`)).toBe('');
    });
  }
});
