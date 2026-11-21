import { ensureClientCards } from '../../client/cards';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { CardType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { checkBenchSize } from '../../game/store/effect-reducers/check-effect';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { EvolveEffect, MoveCardsEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonFromDiscardEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { StadiumDirection } from '../../game/store/state/card-list';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { Store } from '../../game/store/store';
import { getCardByName, padDeck, PlayerConfig, setupGame } from './test-helpers';

const eternatus = 'Eternatus VMAX DAA';
const dark = 'Poochyena ASC';
const grass = 'Hoppip EVS';
const glimmora = 'Glimmora ex OBF';
const bench = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };
const board = { ...bench, slot: SlotType.BOARD };
let store: Store;

beforeAll(ensureClientCards);
afterEach(() => store?.cleanup());

function start(left: Partial<PlayerConfig> = {}, right: Partial<PlayerConfig> = {}, stadium?: string) {
  const game = setupGame({
    turn: 5,
    player1: { active: { card: eternatus }, deck: padDeck(10), ...left },
    player2: { active: { card: 'Regigigas ASR' }, deck: padDeck(10), ...right },
  });
  game.store.cleanup();
  if (stadium) {
    const card = getCardByName(stadium);
    card.id = 800;
    game.player1.stadium.cards = [card];
  }
  store = new Store({ onStateChange: () => undefined });
  store.state = game.state;
  return game;
}

function play(target = bench) {
  store.dispatch(new PlayCardAction(store.state.players[0].id, 0, target));
}

function pending() { return store.state.prompts.find(prompt => prompt.result === undefined); }

function resolve(raw: unknown) {
  const prompt = pending();
  if (!prompt) throw new Error('Expected an unresolved prompt');
  const result = prompt.decode(raw, store.state);
  if (!prompt.validate(result, store.state)) throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
  store.dispatch(new ResolvePromptAction(prompt.id, result));
}

function settleAnimations() {
  while (pending() instanceof WaitPrompt) resolve(true);
}

function settleShuffle() {
  settleAnimations();
  if (!(pending() instanceof ShuffleDeckPrompt)) throw new Error('Expected an unresolved shuffle');
  resolve(store.state.players[0].deck.cards.map((_, index) => index));
  settleAnimations();
}

function slotCounts() {
  checkBenchSize(store, store.state);
  return store.state.players.map(player => player.bench.length);
}

describe('Eternal Zone placement and evolution', () => {
  it('blocks a new non-Dark Basic without relying on a saved marker', () => {
    const { player1 } = start({ hand: [grass] });
    expect(() => play()).toThrow(new GameError(GameMessage.BLOCKED_BY_ABILITY));
    expect(player1.bench[0].getPokemonCard()).toBeUndefined();
    expect(player1.hand.cards[0].fullName).toBe(grass);
    expect(pending()).toBeUndefined();
  });

  it('permits a Darkness Basic and expands the Bench in ordinary play', () => {
    const { player1, player2 } = start({ hand: [dark] });
    play();
    settleAnimations();
    expect(player1.bench.length).toBe(8);
    expect(player2.bench.length).toBe(5);
    expect(player1.bench[0].getPokemonCard()?.fullName).toBe(dark);
  });

  it('ignores a stored marker while Path to the Peak stops the actual Ability', () => {
    const { player1 } = start({ hand: [grass] }, {}, 'Path to the Peak CRE');
    const previous = player1.active.getPokemonCard()!;
    player1.marker.addMarker('ETERNATUS_EXPANDED_BENCH', previous);
    play();
    settleAnimations();
    expect(player1.bench[0].getPokemonCard()?.fullName).toBe(grass);
    expect(player1.bench.length).toBe(5);
    expect(player1.marker.hasMarker('ETERNATUS_EXPANDED_BENCH', previous)).toBe(false);
  });

  it('permits the opponent to Bench a non-Dark Pokémon', () => {
    const { player1 } = start({ active: { card: dark }, hand: [grass] }, { active: { card: eternatus } });
    play();
    settleAnimations();
    expect(player1.bench[0].getPokemonCard()?.fullName).toBe(grass);
    expect(store.state.players.map(player => player.bench.length)).toEqual([5, 8]);
  });

  it('allows a normal entry when an existing Pokémon is non-Dark', () => {
    const { player1 } = start({ hand: [grass], bench: [{ card: grass }] });
    play({ ...bench, index: 1 });
    settleAnimations();
    expect(player1.bench[1].getPokemonCard()?.fullName).toBe(grass);
    expect(player1.bench.length).toBe(5);
  });

  it('rejects a Grass Ariados evolution before it alters the existing board', () => {
    const { player1 } = start({ hand: ['Ariados TWM'], bench: [{ card: 'Spinarak DAA', damage: 10 }] });
    expect(() => play()).toThrow(new GameError(GameMessage.BLOCKED_BY_ABILITY));
    expect(player1.bench[0].getPokemonCard()?.fullName).toBe('Spinarak DAA');
    expect(player1.bench[0].damage).toBe(10);
    expect(player1.hand.cards[0].fullName).toBe('Ariados TWM');
  });

  it('allows Bisharp to evolve from a Darkness Pawniard with both printed types', () => {
    const { player1 } = start({ hand: ['Bisharp STS'], bench: [{ card: 'Pawniard STS' }] });
    play();
    settleAnimations();
    const slot = player1.bench[0];
    expect(slot.getPokemonCard()?.fullName).toBe('Bisharp STS');
    const check = new CheckPokemonTypeEffect(slot);
    store.reduceEffect(store.state, check);
    expect(check.cardTypes).toEqual([CardType.DARK, CardType.METAL]);
    expect(player1.bench.length).toBe(8);
  });

  it('checks an evolution from the deck in the isolated evolution preflight', () => {
    const { player1, state } = start({ deck: ['Ariados TWM', ...padDeck(10)], bench: [{ card: 'Spinarak DAA' }] });
    const candidate = player1.deck.cards[0] as PokemonCard;
    expect(() => store.reduceEffect(state, new EvolveEffect(player1, player1.bench[0], candidate, player1.deck)))
      .toThrow(new GameError(GameMessage.BLOCKED_BY_EFFECT));
    expect(player1.bench[0].getPokemonCard()?.fullName).toBe('Spinarak DAA');
    expect(player1.deck.cards[0]).toBe(candidate);
  });

  for (const trainer of ['Nest Ball SVI', 'Buddy-Buddy Poffin TEF']) {
    it(`shows only legal placements when using ${trainer}`, () => {
      const { player1 } = start({ hand: [trainer], deck: [grass, dark, ...padDeck(10)] });
      play(board);
      settleAnimations();
      const prompt = pending();
      if (!(prompt instanceof ChooseCardsPrompt)) throw new Error('Expected a deck search');
      const prohibited = prompt.cards.cards.findIndex(card => card.fullName === grass);
      const allowed = prompt.cards.cards.findIndex(card => card.fullName === dark);
      expect(prompt.validate([prompt.cards.cards[prohibited]])).toBe(false);
      expect(prompt.validate([prompt.cards.cards[allowed]])).toBe(true);
      expect(prompt.validate([])).toBe(true);
      resolve([allowed]);
      settleShuffle();
      expect(player1.bench[0].getPokemonCard()?.fullName).toBe(dark);
      expect(player1.deck.cards.some(card => card.fullName === grass)).toBe(true);
    });
  }

  it('blocks prohibited discard placements before cards move', () => {
    const { player1, state } = start({ discard: [grass, dark] });
    const [other, allowed] = player1.discard.cards as PokemonCard[];
    expect(() => store.reduceEffect(state, new PlayPokemonFromDiscardEffect(player1, other, player1.bench[0])))
      .toThrow(new GameError(GameMessage.BLOCKED_BY_ABILITY));
    expect(player1.bench[0].cards).toEqual([]);
    const move = new MoveCardsEffect(player1.discard, player1.bench[0], { cards: [other] });
    store.reduceEffect(state, move);
    expect(move.preventDefault).toBe(true);
    expect(player1.discard.cards).toContain(other);
    store.reduceEffect(state, new PlayPokemonFromDiscardEffect(player1, allowed, player1.bench[0]));
    expect(player1.bench[0].getPokemonCard()).toBe(allowed);
  });
});

describe('Bench capacity', () => {
  for (const [left, right, expected] of [
    [eternatus, glimmora, [3, 5]], [glimmora, eternatus, [5, 3]],
  ] as const) {
    it(`uses Dust Field against Eternal Zone with ${left} on the first side`, () => {
      start({ active: { card: left } }, { active: { card: right } });
      expect(slotCounts()).toEqual(expected);
    });
  }

  it('uses Collapsed Stadium’s smaller limit over Eternal Zone', () => {
    start({}, {}, 'Collapsed Stadium BRS');
    expect(slotCounts()).toEqual([4, 4]);
  });

  it('keeps a lower Dust Field capacity under Collapsed Stadium', () => {
    start({}, { active: { card: glimmora } }, 'Collapsed Stadium BRS');
    expect(slotCounts()).toEqual([3, 4]);
  });

  it('preserves Eternal Zone for a player without Tera under Area Zero', () => {
    start({}, { active: { card: 'Charizard ex OBF' } }, 'Area Zero Underdepths SCR');
    expect(slotCounts()).toEqual([8, 8]);
  });

  it('only limits the selected side of Parallel City', () => {
    const { player1 } = start({}, {}, 'Parallel City BKT');
    player1.stadium.stadiumDirection = StadiumDirection.UP;
    expect(slotCounts()).toEqual([8, 3]);
  });

  for (const limitingCard of ['Sudowoodo GRI', 'Ditto TM']) {
    it(`keeps ${limitingCard} on its proper side under Sky Field`, () => {
      start({}, { bench: [{ card: limitingCard }] }, 'Sky Field ROS');
      expect(slotCounts()).toEqual([4, 8]);
    });

    it(`ignores ${limitingCard} in the discard pile`, () => {
      start({}, { discard: [limitingCard] }, 'Sky Field ROS');
      expect(slotCounts()).toEqual([8, 8]);
    });
  }

  it('allows the Bench to shrink before checking lethal damage after Devolution Spray Z', () => {
    const { player1, player2 } = start({
      active: { card: dark },
      hand: ['Devolution Spray Z UB'],
      bench: [{ card: eternatus, damage: 330 }, ...Array.from({ length: 4 }, () => ({ card: dark }))],
    });
    const lower = getCardByName('Eternatus V DAA') as PokemonCard;
    lower.id = 801;
    player1.bench[0].cards.unshift(lower);
    for (let index = 5; index < 8; index++) {
      const slot = new PokemonCardList();
      const card = getCardByName(dark);
      card.id = 810 + index;
      slot.cards = [card];
      player1.bench.push(slot);
    }
    play(board);
    expect(pending() instanceof ChoosePokemonPrompt).toBe(true);
    resolve([bench]);
    const evolution = pending();
    if (!(evolution instanceof ChooseCardsPrompt)) throw new Error('Expected the evolution choice');
    resolve([evolution.cards.cards.findIndex(card => card.fullName === eternatus)]);
    settleShuffle();
    const shrink = pending();
    expect(shrink instanceof ChoosePokemonPrompt && shrink.message).toBe(GameMessage.CHOOSE_POKEMON_TO_DISCARD);
    expect(player1.bench[0].getPokemonCard()).toBe(lower);
    resolve([bench, { ...bench, index: 1 }, { ...bench, index: 2 }]);
    settleAnimations();
    expect(player1.discard.cards).toContain(lower);
    expect(player1.bench.length).toBe(5);
    expect(player2.prizesTaken).toBe(0);
    expect(pending()).toBeUndefined();
  });
});
