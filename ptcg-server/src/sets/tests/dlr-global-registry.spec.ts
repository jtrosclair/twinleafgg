import { ensureClientCards } from '../../client/cards';
import { StateSerializer } from '../../game/serializer/state-serializer';

describe('Delta Reign integrated catalogue', () => {
  it('retains every print when registered with all existing sets', () => {
    const cards = ensureClientCards().filter(card => card.set === 'DLR');
    expect(cards.length).toBe(141);
    expect(cards.map(card => Number(card.setNumber)).sort((a,b) => a-b))
      .toEqual(Array.from({length:141}, (_, i) => i + 1));
    expect(StateSerializer.normalizeCardName('Talonflame ex DLR 88')).toBe(cards.find(card => card.setNumber === '88')!.fullName);
    expect(StateSerializer.normalizeCardName('Mega Rayquaza ex DLR 84')).toBe(cards.find(card => card.setNumber === '84')!.fullName);
    expect(StateSerializer.normalizeCardName('Legendary Pyroduct DLR 94')).toBe(cards.find(card => card.setNumber === '94')!.fullName);
    expect(StateSerializer.normalizeCardName('Legendary Pyroduct DLR 95')).toBe(cards.find(card => card.setNumber === '95')!.fullName);
  });
});
