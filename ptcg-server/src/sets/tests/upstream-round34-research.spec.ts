import { ensureClientCards } from '../../client/cards';
import { CardManager } from '../../game/cards/card-manager';
import { padDeck, setupGame } from './test-helpers';
import { playTrainerCard } from './card-test-helpers';

describe('round34 Research print gameplay', () => {
 beforeAll(() => ensureClientCards());
 for (const n of ['221','222','223']) {
  const name = `Professor's Research${n} SVP`;
  it(`plays SVP ${n}, discards the hand and draws seven`, () => {
   const g = setupGame({ turn: 3, player1: { active: { card: 'Charmander BS' }, hand: [name, 'Water Energy SVE', 'Fire Energy SVE'], deck: padDeck(12) }, player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(12) } });
   playTrainerCard(g.store,g.state,0,name);
   expect(g.player1.hand.cards.length).toBe(7);
   for (const discarded of [name,'Water Energy SVE','Fire Energy SVE']) expect(g.player1.discard.cards.some(c => c.fullName === discarded)).toBe(true);
   expect(g.player1.deck.cards.length).toBe(5);
  });
  it(`has correct metadata and official artwork identity for ${n}`, () => {
   const card = CardManager.getInstance().getAllCards().find(c => c.fullName === name)!;
   expect(card.name).toBe("Professor's Research");
   expect(card.set).toBe('SVP'); expect(card.setNumber).toBe(n);
   expect((card as any).text).toBe('Discard your hand and draw 7 cards.');
   expect(card.regulationMark).toBe('G');
  });
 }
});
