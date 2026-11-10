import { PokemonCard } from '../../game/store/card/pokemon-card';
import { EvolveEffect } from '../../game/store/effects/game-effects';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { setupGame, padDeck, getCardByName } from './test-helpers';

// Names refer to real registered evolution cards and legal printed pre-evolutions.
const pairs = [
  ["Marnie's Grimmsnarl ex DRI", "Marnie's Morgrem DRI", true],
  ['Lycanroc JTG', 'Rockruff JTG', false],
  ['Arboliva SVI', 'Dolliv SVI', true],
  ['Klinklang SIT', 'Klang BRS 103', true],
  ['Togekiss ASR 57', 'Togetic ASR 56', true],
  ['Togetic ASR 56', 'Togepi ASR', true],
  ['Greninja-GX FLI', 'Frogadier FLI', true],
  ['Ninjask DRX', 'Nincada VIV', false],
  ['Aggron DRX', 'Lairon DRX', false],
  ['Drizzile SSH', 'Sobble SSH', true],
  ['Inteleon SSH', 'Drizzile SSH', true],
  ['Parasect LOR 5', 'Paras MT', true],
  ['Eelektrik LOR 60', 'Tynamo VIV', true],
  ['Chandelure LOR 26', 'Lampent LOR 25', true],
  ['Corviknight DAA', 'Corvisquire DAA', true],
  ['Archaludon ex SSP', 'Duraludon SSP', true]
] as const;

function game(evolution: string, basic: string, opponent = 'Mew ex MEW', hood = false) {
  // Numbered print fullNames require their set to be registered first.
  getCardByName('Togepi ASR'); getCardByName('Banette LOR'); getCardByName('Electivire BRS');
  return setupGame({ turn: 5,
    player1: { active: { card: basic, damage: 50, tools: hood ? ['Stealthy Hood UNB'] : [] },
      bench: [{ card: 'Pikachu BS' }], hand: [evolution], discard: ['Metal Energy GEN'], deck: padDeck(10) },
    player2: { active: { card: opponent, tools: opponent === 'Garbodor DRX' ? ['Float Stone PLF'] : [] }, deck: padDeck(10) }
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

describe('upstream evolution ability lifecycle migration', () => {
  for (const [name, previous, turnOnly] of pairs) {
    it(`${name} offers its Ability after a successful hand evolution`, () => {
      const g = game(name, previous);
      let sourceInPlay = false;
      const original = g.store.prompt.bind(g.store);
      spyOn(g.store, 'prompt').and.callFake(((state: any, prompt: any, then: any) => {
        if (prompt instanceof ConfirmPrompt) sourceInPlay = g.player1.active.getPokemonCard()!.fullName === name;
        return original(state, prompt, then);
      }) as any);
      const card = evolve(g);
      expect(g.player1.active.getPokemonCard()).toBe(card);
      expect(confirms(g).length).toBe(1);
      expect(sourceInPlay).toBe(true);
      const prompt = confirms(g)[0];
      const ownDeck = g.player1.deck.cards.slice();
      const opponentDeck = g.player2.deck.cards.slice();
      (g.store as any).reducePrompt(g.state, new ResolvePromptAction(prompt.id, false));
      expect(confirms(g).length).toBe(0);
      expect(g.player1.active.damage).toBe(50);
      expect(g.player1.deck.cards).toEqual(ownDeck);
      expect(g.player2.deck.cards).toEqual(opponentDeck);
    });
    it(`${name} does not activate when evolved from the deck`, () => {
      const g = game(name, previous); const card = evolve(g, 'deck');
      expect(g.player1.active.getPokemonCard()).toBe(card);
      expect(confirms(g).length).toBe(0);
    });
    const psychic = name === 'Togekiss ASR 57' || name === 'Togetic ASR 56';
    it(`${name} respects Wobbuffet's Ability lock and Psychic exception after evolution`, () => {
      const g = game(name, previous, 'Wobbuffet PHF'); const card = evolve(g);
      expect(g.player1.active.getPokemonCard()).toBe(card);
      expect(confirms(g).length).toBe(psychic ? 1 : 0);
    });
    if (psychic) it(`${name} respects Garbodor's Ability lock`, () => {
      const g = game(name, previous, 'Garbodor DRX'); evolve(g);
      expect(confirms(g).length).toBe(0);
    });
    it(`${name} activates with Stealthy Hood protecting it from Wobbuffet`, () => {
      const g = game(name, previous, 'Wobbuffet PHF', true); const card = evolve(g);
      expect(g.player1.active.getPokemonCard()).toBe(card);
      expect(confirms(g).length).toBe(1);
    });
    it(`${name} does not activate when Archeops rejects the evolution`, () => {
      const g = game(name, previous, 'Archeops NVI'); const card = g.player1.hand.cards[0];
      expect(() => evolve(g)).toThrow();
      expect(g.player1.hand.cards).toContain(card);
      expect(g.player1.active.getPokemonCard()!.fullName).toBe(previous);
      expect(confirms(g).length).toBe(0);
    });
    it(`${name} ${turnOnly ? 'does not activate' : 'can activate'} outside its owner's turn when played from hand`, () => {
      const g = game(name, previous); g.state.activePlayer = 1; evolve(g);
      expect(confirms(g).length).toBe(turnOnly ? 0 : 1);
    });
  }

  it('Arboliva offers its healing Ability even with an empty deck', () => {
    const g = game('Arboliva SVI', 'Dolliv SVI');
    g.player1.deck.cards = [];
    evolve(g);
    const confirmation = confirms(g)[0];
    expect(confirmation).toBeDefined();
    (g.store as any).reducePrompt(g.state, new ResolvePromptAction(confirmation.id, true));
    const choice = g.state.prompts.find(p => p instanceof ChoosePokemonPrompt && p.result === undefined)!;
    expect(choice).toBeDefined();
    (g.store as any).reducePrompt(g.state, new ResolvePromptAction(choice.id, [g.player1.active]));
    expect(g.player1.active.damage).toBe(0);
  });
  it('Togetic heals once when its successful hand-evolution Ability is accepted', () => {
    const g = game('Togetic ASR 56', 'Togepi ASR'); evolve(g);
    const prompt = confirms(g)[0];
    (g.store as any).reducePrompt(g.state, new ResolvePromptAction(prompt.id, true));
    expect(g.player1.active.damage).toBe(20);
  });
  it('Chandelure discards the opponent’s top three cards only after accepting', () => {
    const g = game('Chandelure LOR 26', 'Lampent LOR 25'); evolve(g);
    const prompt = confirms(g)[0];
    (g.store as any).reducePrompt(g.state, new ResolvePromptAction(prompt.id, true));
    expect(g.player2.deck.cards.length).toBe(7);
    expect(g.player2.discard.cards.length).toBe(3);
  });
  it('Rare Candy plays Togekiss from hand and resolves its healing Ability', () => {
    getCardByName('Togepi ASR');
    const g = setupGame({turn: 5,
      player1: {active: {card: 'Togepi ASR', damage: 50}, hand: ['Rare Candy SVI', 'Togekiss ASR 57'], deck: padDeck(10)},
      player2: {active: {card: 'Mew ex MEW'}, deck: padDeck(10)}
    });
    g.player1.canEvolve = true; g.player1.active.pokemonPlayedTurn = 1;
    let accepted = 0;
    g.overridePrompt('Confirm', () => { accepted++; return true; });
    g.store.dispatch(new PlayCardAction(g.player1.id, 0, {player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0}));
    expect(g.player1.active.getPokemonCard()!.fullName).toBe('Togekiss ASR 57');
    expect(accepted).toBe(1);
    expect(g.player1.active.damage).toBe(0);
  });
  it('Drizzile through the normal hand action prompts once after evolving', () => {
    const g = game('Drizzile SSH', 'Sobble SSH');
    g.player1.canEvolve = true; g.player1.active.pokemonPlayedTurn = 1;
    let confirmsSeen = 0;
    g.overridePrompt('Confirm', () => { confirmsSeen++; return false; });
    g.store.dispatch(new PlayCardAction(g.player1.id, 0, {player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0}));
    expect(g.player1.active.getPokemonCard()!.fullName).toBe('Drizzile SSH');
    expect(confirmsSeen).toBe(1);
  });
});
