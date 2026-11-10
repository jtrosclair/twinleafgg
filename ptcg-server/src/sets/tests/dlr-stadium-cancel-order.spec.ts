import { getCardByName, padDeck, setupGame } from './test-helpers';
import { playTrainerCard } from './card-test-helpers';
import { CardManager } from '../../game/cards/card-manager';
import { LegendaryLavaLakeLeft, LegendaryLavaLakeRight, LegendarySummitLeft, LegendarySummitRight, LegendaryOceanTrenchLeft, LegendaryOceanTrenchRight } from '../set-delta-reign/legendary-stadiums';

const cards = [new LegendaryLavaLakeLeft(), new LegendaryLavaLakeRight(), new LegendarySummitLeft(), new LegendarySummitRight(), new LegendaryOceanTrenchLeft(), new LegendaryOceanTrenchRight()];
const pairs = [cards.slice(0,2), cards.slice(2,4), cards.slice(4,6)].map(pair => pair.map(card => card.fullName));
function register() { const cm = CardManager.getInstance(); cm.defineSet(cards.filter(card => !cm.isCardDefined(card.fullName))); }
function game(pair: string[], oldName: string) {
  register();
  const g = setupGame({ turn: 3, player1: { active: { card: 'Mew ex MEW' }, hand: pair, deck: padDeck(10) }, player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) } });
  const old = getCardByName(oldName); old.id = 91001; g.player2.stadium.cards = [old];
  g.player1.coinFlipCancelTrainerPlayTurnsRemaining = 1;
  return { ...g, old };
}

describe('Legendary Stadium Trainer-cancellation ordering', () => {
  beforeEach(register);
  for (const pair of pairs) for (const selected of [0, 1]) for (const heads of [false, true]) for (const swell of [false, true]) {
    it(`${pair[0]} half ${selected + 1}, ${heads ? 'heads' : 'tails'}, ${swell ? 'Chaotic Swell' : 'ordinary Stadium'}`, () => {
      const g = game(pair, swell ? 'Chaotic Swell CEC' : 'Path to the Peak CRE');
      const random = spyOn(Math, 'random').and.returnValue(heads ? 0.1 : 0.9);
      playTrainerCard(g.store, g.state, 0, pair[selected]);
      expect(random.calls.count()).toBe(1);
      expect(g.player1.hand.cards.length).toBe(0);
      if (!heads) {
        expect(g.player2.stadium.cards).toEqual([g.old]);
        expect(g.player2.discard.cards).not.toContain(g.old);
        expect(g.player1.discard.cards.map(card => card.fullName).sort()).toEqual([...pair].sort());
        expect(g.player1.stadium.cards.length).toBe(0);
        expect(g.player1.stadiumPlayedTurn).not.toBe(g.state.turn);
      } else if (swell) {
        expect(g.player2.stadium.cards.length).toBe(0);
        expect(g.player2.discard.cards).toContain(g.old);
        expect(g.player1.discard.cards.map(card => card.fullName).sort()).toEqual([...pair].sort());
        expect(g.player1.stadium.cards.length).toBe(0);
        expect(g.player1.stadiumPlayedTurn).toBe(g.state.turn);
      } else {
        expect(g.player2.stadium.cards.length).toBe(0);
        expect(g.player2.discard.cards).toContain(g.old);
        expect(g.player1.discard.cards.length).toBe(0);
        expect(g.player1.stadium.cards.map(card => card.fullName)).toEqual(pair);
        expect(g.player1.stadiumPlayedTurn).toBe(g.state.turn);
      }
    });
  }
  it('does not flip or disturb Chaotic Swell when the second half is absent', () => {
    const g = game([pairs[0][0]], 'Chaotic Swell CEC'); const random = spyOn(Math, 'random');
    expect(() => playTrainerCard(g.store, g.state, 0, pairs[0][0])).toThrow();
    expect(random).not.toHaveBeenCalled(); expect(g.player2.stadium.cards).toEqual([g.old]);
    expect(g.player1.hand.cards.map(card => card.fullName)).toEqual([pairs[0][0]]);
    expect(g.player1.discard.cards.length).toBe(0);
  });
  it('does not flip or disturb either Stadium when Stadiums are locked', () => {
    const g = game(pairs[0], 'Chaotic Swell CEC'); g.player1.marker.addMarkerToState(g.player1.ATTACK_EFFECT_STADIUM_LOCK);
    const random = spyOn(Math, 'random'); expect(() => playTrainerCard(g.store, g.state, 0, pairs[0][0])).toThrow();
    expect(random).not.toHaveBeenCalled(); expect(g.player2.stadium.cards).toEqual([g.old]);
    expect(g.player1.hand.cards.map(card => card.fullName)).toEqual(pairs[0]);
  });
});
