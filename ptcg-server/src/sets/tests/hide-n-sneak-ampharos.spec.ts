import { PokemonCard } from '../../game/store/card/pokemon-card';
import { EvolveEffect, PowerEffect, PutDamageCountersEffect } from '../../game/store/effects/game-effects';
import { setupGame, padDeck } from './test-helpers';

const ampharos = "Team Rocket's Ampharos DRI";
function game(previous = 'Shuppet M5', evolved = 'Banette M5', options: {
  opposingActive?: string; opposingBench?: string[]; ownAmpharos?: boolean; tool?: string;
} = {}) {
  return setupGame({ turn: 5,
    player1: { active: { card: previous, damage: 10, tools: options.tool ? [options.tool] : [] },
      bench: options.ownAmpharos ? [{ card: ampharos }] : [], hand: [evolved], deck: padDeck(10) },
    player2: { active: { card: options.opposingActive || ampharos },
      bench: (options.opposingBench || []).map(card => ({ card })), deck: padDeck(10) }
  });
}
function evolve(g: ReturnType<typeof game>, source: 'hand' | 'deck' = 'hand') {
  const card = g.player1.hand.cards[0] as PokemonCard;
  if (source === 'deck') g.player1.hand.moveCardTo(card, g.player1.deck);
  g.store.reduceEffect(g.state, new EvolveEffect(g.player1, g.player1.active, card, g.player1[source]));
  expect(g.player1.active.getPokemonCard()).toBe(card);
  return g.player1.active.damage;
}

describe('Hide n Sneak versus Team Rocket’s Ampharos', () => {
  for (const [previous, evolved] of [
    ['Shuppet M5', 'Banette M5'], ['Shuppet JTG', 'Banette M5'],
    ['Poltchageist M5', 'Sinistcha M5'], ['Poltchageist TWM', 'Sinistcha M5']
  ]) {
    it(`protects ${evolved} after evolving from ${previous}`, () => {
      const g = game(previous, evolved); expect(evolve(g)).toBe(10);
    });
  }
  for (const [previous, evolved] of [
    ['Shuppet M5', 'Banette JTG'], ['Poltchageist M5', 'Sinistcha TWM']
  ]) {
    it(`does not retain ${previous}'s immunity after evolving into ${evolved}`, () => {
      const g = game(previous, evolved); expect(evolve(g)).toBe(50);
    });
  }
  for (const name of ['Shuppet M5', 'Banette M5', 'Poltchageist M5', 'Sinistcha M5']) {
    it(`${name} blocks Ampharos-sourced counter effects`, () => {
      const g = game(name);
      const source = g.player2.active.getPokemonCard()!;
      const power = new PowerEffect(g.player2, source.powers[0], source, g.player1.active);
      g.store.reduceEffect(g.state, new PutDamageCountersEffect(power, 40));
      expect(g.player1.active.damage).toBe(10);
    });
  }
  it('still adds four counters to an unprotected evolution', () => {
    const g = game('Shuppet JTG', 'Banette JTG'); expect(evolve(g)).toBe(50);
  });
  it('does not stack multiple opposing Ampharos', () => {
    const g = game('Shuppet JTG', 'Banette JTG', { opposingBench: [ampharos] });
    expect(evolve(g)).toBe(50);
  });
  it('does not react to an evolution from the deck', () => {
    const g = game('Shuppet JTG', 'Banette JTG'); expect(evolve(g, 'deck')).toBe(10);
  });
  it('does not react outside the evolving player’s turn', () => {
    const g = game('Shuppet JTG', 'Banette JTG'); g.state.activePlayer = 1;
    expect(evolve(g)).toBe(10);
  });
  it('does not react when Ampharos belongs to the evolving player', () => {
    const g = game('Shuppet JTG', 'Banette JTG', { ownAmpharos: true, opposingActive: 'Mew ex MEW' });
    expect(evolve(g)).toBe(10);
  });
  it('respects suppression of Ampharos’s Ability', () => {
    const g = game('Shuppet JTG', 'Banette JTG', { opposingActive: 'Wobbuffet PHF', opposingBench: [ampharos] });
    expect(evolve(g)).toBe(10);
  });
  it('adds counters when the evolved Pokémon’s Hide n Sneak is suppressed', () => {
    const g = game('Shuppet M5', 'Banette M5', { opposingActive: 'Flutter Mane TEF', opposingBench: [ampharos] });
    expect(evolve(g)).toBe(50);
  });
  it('respects Stealthy Hood on an otherwise unprotected evolution', () => {
    const g = game('Shuppet JTG', 'Banette JTG', { tool: 'Stealthy Hood UNB' });
    expect(evolve(g)).toBe(10);
  });
});
