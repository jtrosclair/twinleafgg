import { ensureClientCards } from '../../client/cards';
import { AttackAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { CardTarget, PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { BoardEffect } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect, MoveCardsEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { SelectPrompt } from '../../game/store/prompts/select-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Store } from '../../game/store/store';
import { Goodra } from '../set-forbidden-light/goodra';
import { padDeck, setupGame, SetupGameConfig } from './test-helpers';

const active = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const bench = { ...active, slot: SlotType.BENCH };
const secondBench = { ...bench, index: 1 };
const board = { ...active, slot: SlotType.BOARD };
const fire = 'Fire Energy SVE';
const grass = 'Grass Energy SVE';
const water = 'Water Energy SVE';
const lightning = 'Lightning Energy SVE';
const rainbow = 'Rainbow Energy SUM';
const finneon = 'Finneon MT';
const neo = 'Eevee N2';
const flareon = 'Flareon AOR';
const leafeon = 'Leafeon PLF';
const jolteon = 'Jolteon AOR';
const crispin = 'Crispin SCR';
const trumpet = 'Glass Trumpet SCR';
const tera = 'Terapagos ex SCR';
const joltik = 'Joltik SCR';
const whimsicott = 'Whimsicott ex SV11W';
const archeops = 'Archeops SIT';
const sada = "Professor Sada's Vitality PAR";
const bolt = 'Raging Bolt ex TEF';

describe('Deck and discard Energy attachments finish before their triggered effects', () => {
  beforeAll(ensureClientCards);
  let store: Store;
  afterEach(() => store?.cleanup());

  function open(player1: SetupGameConfig['player1'], player2: SetupGameConfig['player2'] = { active: { card: finneon } }) {
    store?.cleanup();
    const game = setupGame({ turn: 5, player1: { deck: padDeck(8), ...player1 },
      player2: { deck: padDeck(8), ...player2 } });
    store = new Store({ onStateChange: () => undefined });
    store.state = game.state;
    game.store.cleanup();
    return game;
  }

  function pending() {
    return store.state.prompts.find(prompt => prompt.result === undefined);
  }

  function resolve(raw: unknown) {
    const prompt = pending();
    if (!prompt) throw new Error('Missing pending prompt');
    const result = prompt.decode(raw, store.state);
    if (!prompt.validate(result, store.state)) throw new Error(`Invalid test result for ${prompt.type}`);
    store.dispatch(new ResolvePromptAction(prompt.id, result));
  }

  function choose(...names: string[]) {
    const search = pending() as ChooseCardsPrompt;
    expect(search instanceof ChooseCardsPrompt).toBe(true);
    resolve(names.map(name => search.cards.cards.findIndex(card => card.fullName === name)));
  }

  function attach(...assignments: [string, CardTarget][]) {
    const attachment = pending() as AttachEnergyPrompt;
    expect(attachment instanceof AttachEnergyPrompt).toBe(true);
    resolve(assignments.map(([name, to]) => ({
      index: attachment.cardList.cards.findIndex(card => card.fullName === name), to,
    })));
  }

  function shuffle(order: number[]) {
    expect(pending() instanceof ShuffleDeckPrompt).toBe(true);
    resolve(order);
  }

  function orderBy(label: string, ownerId: number) {
    const order = pending() as SelectPrompt;
    expect(order instanceof SelectPrompt).toBe(true);
    expect(order.playerId).toBe(ownerId);
    const index = order.values.findIndex(value => value.includes(label));
    expect(index).toBeGreaterThanOrEqual(0);
    resolve(index);
  }

  function attack(name: string, playerId: number) {
    store.dispatch(new AttackAction(playerId, name));
    if ((pending() as WaitPrompt)?.message === 'Attack animation') resolve(true);
  }

  it('completes the Crispin reveal, attachment, hand move and shuffle before Neo Eevee flips', () => {
    const { player1, player2 } = open({ active: { card: finneon }, bench: [{ card: neo }],
      hand: [crispin], deck: [fire, flareon, grass, lightning] }, { active: { card: 'Arctozolt DAA' } });
    spyOn(Math, 'random').and.returnValue(0.1);
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    choose(fire, grass);
    const reveal = pending() as ShowCardsPrompt;
    expect(reveal instanceof ShowCardsPrompt).toBe(true);
    expect(reveal.playerId).toBe(player2.id);
    expect(reveal.cards.map(card => card.fullName)).toEqual([fire, grass]);
    expect(player1.hand.cards).toEqual([]);
    resolve(true);
    expect(store.state.prompts.filter(prompt => prompt.result === undefined).length).toBe(1);
    attach([fire, bench]);
    expect(player1.hand.cards.map(card => card.fullName)).toEqual([grass]);
    expect(player1.bench[0].energies.cards.map(card => card.fullName)).toEqual([fire]);
    expect(player1.bench[0].damage).toBe(0);
    expect(pending() instanceof ShuffleDeckPrompt).toBe(true);
    shuffle([1, 0]);
    expect(pending() instanceof WaitPrompt).toBe(true);
    resolve(true);
    choose(flareon);
    shuffle([0]);
    expect(player1.bench[0].getPokemonCard()?.fullName).toBe(flareon);
    expect(player1.energyPlayedTurn).not.toBe(5);
  });

  it('puts a single Energy found by Crispin into the hand', () => {
    const { player1 } = open({ active: { card: neo }, hand: [crispin], deck: [fire, flareon] });
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    choose(fire);
    expect(pending() instanceof ShowCardsPrompt).toBe(true);
    resolve(true);
    expect(pending() instanceof ShuffleDeckPrompt).toBe(true);
    shuffle([0]);
    expect(player1.hand.cards.map(card => card.fullName)).toEqual([fire]);
    expect(player1.active.energies.cards).toEqual([]);
    expect(pending()).toBeUndefined();
  });

  it('shuffles after a zero-card search but rejects Crispin with an empty deck', () => {
    const { player1 } = open({ active: { card: neo }, hand: [crispin], deck: [fire, flareon] });
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    choose();
    shuffle([1, 0]);
    expect(player1.discard.cards.map(card => card.fullName)).toContain(crispin);

    const next = open({ active: { card: neo }, hand: [crispin], deck: [] });
    expect(() => store.dispatch(new PlayCardAction(next.player1.id, 0, board))).toThrow();
    expect(next.player1.hand.cards.map(card => card.fullName)).toEqual([crispin]);
  });

  it('rejects two different printings of the same Basic Energy type in Crispin', () => {
    const oldFire = 'Fire Energy SUM';
    const { player1 } = open({ active: { card: neo }, hand: [crispin], deck: [oldFire, fire, grass] });
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    const search = pending() as ChooseCardsPrompt;
    const indices = [oldFire, fire].map(name => search.cards.cards.findIndex(card => card.fullName === name));
    expect(search.validate(search.decode(indices))).toBe(false);
    expect(player1.deck.cards.length).toBe(3);
    choose(oldFire, grass);
    expect(pending() instanceof ShowCardsPrompt).toBe(true);
  });

  it('finishes both Glass Trumpet attachments and identifies the Bench slots for two Eevee triggers', () => {
    const { player1 } = open({ active: { card: tera }, bench: [{ card: neo }, { card: neo }],
      hand: [trumpet], discard: [fire, grass], deck: [flareon, leafeon] });
    spyOn(Math, 'random').and.returnValues(0.1, 0.9);
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    attach([fire, bench], [grass, secondBench]);
    expect(player1.discard.cards.map(card => card.fullName)).toEqual([trumpet]);
    expect(player1.bench.slice(0, 2).map(slot => slot.energies.cards[0]?.fullName)).toEqual([fire, grass]);
    orderBy('Bench 2', player1.id);
    resolve(true);
    choose(leafeon);
    shuffle([0]);
    resolve(true);
    expect(pending()).toBeUndefined();
    expect(player1.bench[0].getPokemonCard()?.fullName).toBe(neo);
    expect(player1.bench[1].getPokemonCard()?.fullName).toBe(leafeon);
  });

  it('returns Glass Trumpet to its original hand position when there is no Colorless Bench target', () => {
    const { player1 } = open({ active: { card: tera }, bench: [{ card: finneon }],
      hand: [fire, trumpet, grass], discard: [water] });
    expect(() => store.dispatch(new PlayCardAction(player1.id, 1, board))).toThrow();
    expect(player1.hand.cards.map(card => card.fullName)).toEqual([fire, trumpet, grass]);
    expect(player1.supporter.cards).toEqual([]);
    expect(pending()).toBeUndefined();
  });

  it('requires Glass Trumpet to target distinct Benched Pokémon and choose at least one', () => {
    const { player1 } = open({ active: { card: tera }, bench: [{ card: neo }, { card: neo }],
      hand: [trumpet], discard: [fire, grass, rainbow] });
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    const prompt = pending() as AttachEnergyPrompt;
    expect(prompt.validate([])).toBe(false);
    expect(prompt.validate(prompt.decode([{ index: 0, to: bench }, { index: 1, to: bench }], store.state))).toBe(false);
    expect(prompt.isEligibleCard(player1.discard.cards.find(card => card.fullName === rainbow)!)).toBe(false);
  });

  it('gives the player the choice between Jolting Charge reactions from two types on one Eevee', () => {
    const { player1 } = open({ active: { card: joltik, energy: [grass] },
      bench: [{ card: neo }], deck: [grass, lightning, leafeon, jolteon] });
    spyOn(Math, 'random').and.returnValue(0.1);
    attack('Jolting Charge', player1.id);
    attach([grass, bench], [lightning, bench]);
    expect(player1.bench[0].energies.cards.length).toBe(2);
    shuffle([1, 0]);
    if ((pending() as WaitPrompt)?.message === 'Attack animation') resolve(true);
    orderBy('Lightning Energy', player1.id);
    resolve(true);
    choose(jolteon);
    shuffle([0]);
    expect(player1.bench[0].getPokemonCard()?.fullName).toBe(jolteon);
    expect(player1.deck.cards.map(card => card.fullName)).toEqual([leafeon]);
  });

  it('still shuffles if Whimsicott finds zero Basic Energy with Energy Gift', () => {
    const { player1 } = open({ active: { card: whimsicott, energy: [grass] }, deck: [fire, lightning] });
    attack('Energy Gift', player1.id);
    attach();
    shuffle([1, 0]);
    expect(player1.deck.cards.map(card => card.fullName)).toEqual([lightning, fire]);
  });

  it('draws the available cards with Sada only after attaching from the discard', () => {
    const { player1 } = open({ active: { card: bolt }, bench: [{ card: bolt }],
      hand: [sada], discard: [fire, lightning], deck: [grass, water] });
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    attach([fire, active], [lightning, bench]);
    expect(player1.active.energies.cards.map(card => card.fullName)).toEqual([fire]);
    expect(player1.bench[0].energies.cards.map(card => card.fullName)).toEqual([lightning]);
    expect(player1.hand.cards.map(card => card.fullName)).toEqual([grass, water]);
    expect(player1.ancientSupporter).toBe(true);
    expect(pending()).toBeUndefined();
  });

  it('leaves the Sada draw in the deck when attachment movement is prevented', () => {
    const { player1, player2 } = open({ active: { card: bolt }, hand: [sada], discard: [fire], deck: [grass, water] });
    const defender = player2.active.getPokemonCard()!;
    const original = defender.reduceEffect.bind(defender);
    spyOn(defender, 'reduceEffect').and.callFake((probe: StoreLike, state: State, effect: Effect) => {
      if (effect instanceof MoveCardsEffect && effect.source === player1.discard && effect.destination === player1.active) {
        effect.preventDefault = true;
      }
      return original(probe, state, effect);
    });
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    attach([fire, active]);
    expect(player1.active.energies.cards).toEqual([]);
    expect(player1.hand.cards).toEqual([]);
    expect(player1.deck.cards.map(card => card.fullName)).toEqual([grass, water]);
    expect(player1.discard.cards.map(card => card.fullName)).toContain(fire);
  });

  it('spends Primal Turbo when the player searches and selects no cards', () => {
    const { player1 } = open({ active: { card: archeops }, deck: [fire, rainbow] });
    store.dispatch(new UseAbilityAction(player1.id, 'Primal Turbo', active));
    attach();
    shuffle([1, 0]);
    expect(player1.active.boardEffect).toContain(BoardEffect.ABILITY_USED);
    expect(() => store.dispatch(new UseAbilityAction(player1.id, 'Primal Turbo', active))).toThrow();
  });

  it('only counts actual healing toward Goodra’s Soaking Horn', () => {
    const { player1 } = open({ active: { card: 'Goodra FLI' }, hand: ['Dyna Tree Hill CRE'] });
    const goodra = player1.active.getPokemonCard() as Goodra;
    store.reduceEffect(store.state, new HealEffect(player1, player1.active, 20));
    expect(player1.marker.hasMarker(goodra.HYDRATION_MARKER, goodra)).toBe(false);

    store.dispatch(new PlayCardAction(player1.id, 0, board));
    player1.active.damage = 30;
    store.reduceEffect(store.state, new HealEffect(player1, player1.active, 20));
    expect(player1.active.damage).toBe(30);
    expect(player1.marker.hasMarker(goodra.HYDRATION_MARKER, goodra)).toBe(false);
    player1.stadium.moveTo(player1.discard);

    store.reduceEffect(store.state, new HealEffect(player1, player1.active, 20));
    expect(player1.active.damage).toBe(10);
    expect(player1.marker.hasMarker(goodra.HYDRATION_MARKER, goodra)).toBe(true);
  });

  for (const [pokemon, heal] of [['Goodra FLI', 20], ['Eiscue V RCL', 30]] as const) {
    it(`${pokemon} heals only when Water Energy was attached from hand`, () => {
      const { player1 } = open({ active: { card: pokemon, damage: 50 }, hand: [water], deck: [water] });
      store.reduceEffect(store.state, new AttachEnergyEffect(player1, player1.deck.cards[0] as EnergyCard, player1.active, 'deck'));
      expect(player1.active.damage).toBe(50);
      store.dispatch(new PlayCardAction(player1.id, 0, active));
      expect(player1.active.damage).toBe(50 - heal);
      expect(player1.active.energies.cards.length).toBe(2);
    });

    it(`${pokemon} uses the Water that a Special Energy provides after attachment`, () => {
      const { player1 } = open({ active: { card: pokemon, damage: 50 }, hand: [rainbow] });
      store.dispatch(new PlayCardAction(player1.id, 0, active));
      orderBy(pokemon.startsWith('Goodra') ? 'Hydration' : 'Cold Absorption', player1.id);
      expect(player1.active.damage).toBe(50 - heal + 10);
      expect(pending()).toBeUndefined();
    });
  }
});
