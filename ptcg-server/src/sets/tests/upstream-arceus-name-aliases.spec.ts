import { getCardByName } from './test-helpers';

describe('Arceus set upstream name aliases', () => {
  for (const [alias, fullName, setNumber] of [
    ['Electrike AR', 'Electrike AR 62', '62'],
    ['Tangela AR', 'Tangela AR 76', '76'],
    ['Treecko AR', 'Treecko AR 78', '78'],
  ]) {
    it(`resolves ${alias} to the existing numbered print`, () => {
      const card = getCardByName(alias);
      expect(card.fullName).toBe(fullName);
      expect(card.setNumber).toBe(setNumber);
    });
  }
});
