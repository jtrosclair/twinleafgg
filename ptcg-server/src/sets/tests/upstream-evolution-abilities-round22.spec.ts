import { SpecialCondition } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { EvolveEffect } from '../../game/store/effects/game-effects';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { setupGame, padDeck, getCardByName } from './test-helpers';

// turnOnly mirrors the printed trigger, not a global rule for all eras.
const pairs = [
  ['Bewear GRI', 'Stufful SUM', true, false],
  ['Alakazam M1S', 'Kadabra BS', true, true],
  ['Kadabra M1S', 'Abra BS', true, true],
  ['Haunter BKT', 'Gastly BKT', false, true],
  ['Mismagius BKT', 'Misdreavus BKT', false, true],
  ['Rhyperior BUS', 'Rhydon BUS', true, false],
  ['Floette CEC', 'Flabébé BKT', true, false],
  ['Butterfree FST', 'Metapod BS', true, false],
  ['Forretress FLF', 'Pineco FLF', false, false],
  ['Galarian Obstagoon SSH', 'Galarian Linoone ASC', true, false],
  ['Galarian Obstagoon VIV', 'Galarian Linoone ASC', true, false],
  ['Alcremie VIV', 'Milcery VIV', true, true]
] as const;

function game(evolution: string, previous: string, opponent = 'Mew ex MEW', hood = false) {
  getCardByName('Buneary M1L');
  return setupGame({ turn: 5,
    player1: { active: { card: previous, damage: 30, tools: hood ? ['Stealthy Hood UNB'] : [] },
      bench: [{ card: 'Pikachu BS' }], hand: [evolution], deck: padDeck(10) },
    player2: { active: { card: opponent, tools: opponent === 'Garbodor DRX' ? ['Float Stone PLF'] : [] }, hand: ['Water Energy SVE'], deck: padDeck(10) }
  });
}
function confirms(g: ReturnType<typeof game>) {
  return g.state.prompts.filter(p => p instanceof ConfirmPrompt && p.result === undefined) as ConfirmPrompt[];
}
function evolve(g: ReturnType<typeof game>, source: 'hand' | 'deck' = 'hand') {
  const card = g.player1.hand.cards[0] as PokemonCard;
  if (source === 'deck') g.player1.hand.moveCardTo(card, g.player1.deck);
  g.store.reduceEffect(g.state, new EvolveEffect(g.player1, g.player1.active, card, g.player1[source]));
  return card;
}

describe('accepted evolution abilities round 22', () => {
  for (const [name, previous, turnOnly, psychic] of pairs) {
    it(`${name} offers its Ability only after it is in play`, () => {
      const g = game(name, previous); let inPlay = false;
      const original = g.store.prompt.bind(g.store);
      spyOn(g.store, 'prompt').and.callFake(((state: any, prompt: any, then: any) => {
        if (prompt instanceof ConfirmPrompt) inPlay = g.player1.active.getPokemonCard()!.fullName === name;
        return original(state, prompt, then);
      }) as any);
      const card = evolve(g); expect(g.player1.active.getPokemonCard()).toBe(card);
      expect(confirms(g).length).toBe(1); expect(inPlay).toBe(true);
      (g.store as any).reducePrompt(g.state, new ResolvePromptAction(confirms(g)[0].id, false));
      expect(confirms(g).length).toBe(0);
    });
    it(`${name} does not trigger when evolving from deck`, () => {
      const g = game(name, previous); const card = evolve(g, 'deck');
      expect(g.player1.active.getPokemonCard()).toBe(card); expect(confirms(g).length).toBe(0);
    });
    it(`${name} respects active Ability suppression`, () => {
      const g = game(name, previous, psychic ? 'Garbodor DRX' : 'Wobbuffet PHF'); evolve(g);
      expect(confirms(g).length).toBe(0);
    });
    it(`${name} permits its Ability against Wobbuffet with Stealthy Hood`, () => {
      const g = game(name, previous, 'Wobbuffet PHF', true); evolve(g);
      expect(confirms(g).length).toBe(1);
    });
    it(`${name} does not trigger a rejected evolution`, () => {
      const g = game(name, previous, 'Archeops NVI'); const card = g.player1.hand.cards[0];
      expect(() => evolve(g)).toThrow(); expect(g.player1.hand.cards).toContain(card); expect(confirms(g).length).toBe(0);
    });
    it(`${name} ${turnOnly ? 'does not trigger' : 'can trigger'} off turn`, () => {
      const g = game(name, previous); g.state.activePlayer = 1; evolve(g);
      expect(confirms(g).length).toBe(turnOnly ? 0 : 1);
    });
  }
  for (const [name, previous, _turnOnly, psychic] of pairs) {
    it(`${name} offers its hand-evolution Ability from the Bench`, () => {
      getCardByName('Buneary M1L');
      const g = setupGame({turn: 5,
        player1: {active: {card: 'Pikachu BS'}, bench: [{card: previous}], hand: [name], deck: padDeck(10)},
        player2: {active: {card: 'Mew ex MEW'}, hand: ['Water Energy SVE'], deck: padDeck(10)}
      });
      const card = g.player1.hand.cards[0] as PokemonCard;
      g.store.reduceEffect(g.state, new EvolveEffect(g.player1, g.player1.bench[0], card, g.player1.hand));
      expect(g.player1.bench[0].getPokemonCard()).toBe(card);
      expect(confirms(g).length).toBe(1);
    });
    it(`${name} respects Ability suppression on the Bench`, () => {
      getCardByName('Buneary M1L');
      const g = setupGame({turn: 5,
        player1: {active: {card: 'Pikachu BS'}, bench: [{card: previous}], hand: [name], deck: padDeck(10)},
        player2: {active: {card: psychic ? 'Garbodor DRX' : 'Wobbuffet PHF', tools: psychic ? ['Float Stone PLF'] : []}, deck: padDeck(10)}
      });
      const card = g.player1.hand.cards[0] as PokemonCard;
      g.store.reduceEffect(g.state, new EvolveEffect(g.player1, g.player1.bench[0], card, g.player1.hand));
      expect(g.player1.bench[0].getPokemonCard()).toBe(card);
      expect(confirms(g).length).toBe(0);
    });
  }
  it('Haunter confuses both Active Pokémon when accepted', () => {
    const g = game('Haunter BKT', 'Gastly BKT'); evolve(g);
    (g.store as any).reducePrompt(g.state, new ResolvePromptAction(confirms(g)[0].id, true));
    expect(g.player1.active.specialConditions).toContain(SpecialCondition.CONFUSED);
    expect(g.player2.active.specialConditions).toContain(SpecialCondition.CONFUSED);
  });
  it('Rhyperior discards the opponent’s top three cards when accepted', () => {
    const g = game('Rhyperior BUS', 'Rhydon BUS'); evolve(g);
    (g.store as any).reducePrompt(g.state, new ResolvePromptAction(confirms(g)[0].id, true));
    expect(g.player2.deck.cards.length).toBe(7); expect(g.player2.discard.cards.length).toBe(3);
  });
  it('Forretress places a damage counter on each opposing Pokémon when accepted', () => {
    const g = game('Forretress FLF', 'Pineco FLF'); evolve(g);
    (g.store as any).reducePrompt(g.state, new ResolvePromptAction(confirms(g)[0].id, true));
    expect(g.player2.active.damage).toBe(10);
  });
  it('Bewear draws three cards when its accepted Ability resolves', () => {
    const g = game('Bewear GRI', 'Stufful SUM'); evolve(g);
    (g.store as any).reducePrompt(g.state, new ResolvePromptAction(confirms(g)[0].id, true));
    expect(g.player1.hand.cards.length).toBe(3); expect(g.player1.deck.cards.length).toBe(7);
  });
  it('Alcremie draws one card for each player when accepted', () => {
    const g = game('Alcremie VIV', 'Milcery VIV'); evolve(g);
    (g.store as any).reducePrompt(g.state, new ResolvePromptAction(confirms(g)[0].id, true));
    expect(g.player1.hand.cards.length).toBe(1); expect(g.player2.hand.cards.length).toBe(2);
  });
});
