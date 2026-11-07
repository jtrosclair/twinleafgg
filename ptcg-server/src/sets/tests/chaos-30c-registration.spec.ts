// Exercise the compiled production registry; source contains legacy JS siblings.
const sets = require('../../../output/sets');
import { Card } from '../../game/store/card/card';
import { ensureClientCards } from '../../client/cards';
const { CardManager } = require('../../../output/game/cards/card-manager');

describe('Chaos Rising and 30C production registration', () => {
  it('registers both target sets in the executable browser library', () => {
    const cards = ensureClientCards();
    for (const set of [sets.setChaosRising, sets.set30thCelebration]) {
      expect(set.length).toBeGreaterThan(0);
      for (const card of set) {
        expect(cards.some(loaded => loaded.fullName === card.fullName)).toBe(true);
      }
    }
  });
  it('exports 30C through the production set registry', () => {
    const registry = sets as unknown as { [key: string]: Card[] };
    expect(Array.isArray(registry.set30thCelebration)).toBe(true);
    expect((registry.set30thCelebration || []).length).toBeGreaterThan(0);
  });

  it('loads every set without duplicate identities and resolves target cards', () => {
    const manager = new CardManager();
    const registry = sets as unknown as { [key: string]: Card[] };
    Object.keys(registry).forEach(key => manager.defineSet(registry[key]));
    expect(manager.getAllCards().some((card: Card) => card.set === '30C')).toBe(true);
    for (const key of ['setChaosRising', 'set30thCelebration']) {
      for (const card of registry[key] || []) {
        const loaded = manager.getCardByName(card.fullName);
        expect(loaded).toBeDefined();
        expect(loaded && loaded.set).toBe(card.set);
        expect(loaded && loaded.setNumber).toBe(card.setNumber);
      }
    }
  });
});
