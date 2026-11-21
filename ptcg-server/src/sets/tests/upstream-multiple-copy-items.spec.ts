import { ensureClientCards } from '../../client/cards';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { SpecialCondition } from '../../game/store/card/card-types';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { ChoosePrizePrompt } from '../../game/store/prompts/choose-prize-prompt';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { OrderCardsPrompt } from '../../game/store/prompts/order-cards-prompt';
import { SelectOptionPrompt } from '../../game/store/prompts/select-option-prompt';
import { SelectPrompt } from '../../game/store/prompts/select-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { Store } from '../../game/store/store';
import { setupGame, SetupGameConfig } from './test-helpers';

const board = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0 };
const bench = { ...board, slot: SlotType.BENCH };
const foeBench = { ...bench, player: PlayerType.TOP_PLAYER };
const finneon = 'Finneon MT';
const mew = 'Mew ex MEW';
const dedenne = 'Dedenne-GX UNB';
const water = 'Water Energy SVE';
const fire = 'Fire Energy SVE';
const psychic = 'Psychic Energy SVE';
const basicDeck = [water, fire, psychic];
const catcher = 'Custom Catcher LOT';
const catcherAlt = 'Custom Catcher2 LOT';
const puzzle = 'Puzzle of Time BKP';
const herbs = 'Mixed Herbs LOT';
const stone = 'Quad Stone SIT 163';
const clover = 'Missing Clover UPR';
const cross = 'Cross Switcher FST';
const ring = 'Beast Ring FLI';
const naga = 'Naganadel LOT';
const poipole = 'Poipole FLI';

describe('Items that play multiple copies and Beast Ring', () => {
  beforeAll(ensureClientCards);
  let store: Store;
  afterEach(() => store?.cleanup());

  function open(player1: Partial<SetupGameConfig['player1']>, player2: Partial<SetupGameConfig['player2']> = {}) {
    const game = setupGame({ turn: 5,
      player1: { active: { card: finneon }, deck: basicDeck, ...player1 },
      player2: { active: { card: mew }, deck: basicDeck, ...player2 }
    });
    store = new Store({ onStateChange: () => undefined });
    store.state = game.state;
    game.store.cleanup();
    return { owner: game.player1, opponent: game.player2 };
  }

  function play() {
    store.dispatch(new PlayCardAction(store.state.players[0].id, 0, board));
  }

  function pending() {
    return store.state.prompts.find(prompt => prompt.result === undefined);
  }

  function resolve(raw: unknown) {
    const prompt = pending();
    if (!prompt) throw new Error('Missing pending prompt');
    const result = prompt.decode(raw, store.state);
    if (!prompt.validate(result, store.state)) throw new Error('Invalid test prompt result');
    store.dispatch(new ResolvePromptAction(prompt.id, result));
  }

  it('uses exactly two Custom Catchers with different artwork and only switches the opponent', () => {
    const { owner, opponent } = open({ hand: [catcherAlt, catcher], deck: [], bench: [] }, { bench: [{ card: dedenne }] });
    const copies = [...owner.hand.cards];
    play();
    expect(pending() instanceof ChoosePokemonPrompt).toBe(true);
    resolve([foeBench]);
    expect(opponent.active.getPokemonCard()?.fullName).toBe(dedenne);
    expect(owner.active.getPokemonCard()?.fullName).toBe(finneon);
    expect(owner.discard.cards).toEqual(jasmine.arrayWithExactContents(copies));
    expect(owner.supporter.cards).toEqual([]);
    expect(pending()).toBeUndefined();
  });

  it('lets a player choose one Custom Catcher when both modes are legal', () => {
    const { owner, opponent } = open({ hand: [catcher, catcherAlt] }, { bench: [{ card: dedenne }] });
    const [first, second] = owner.hand.cards;
    const drawn = owner.deck.cards.slice(0, 2);
    play();
    expect(pending() instanceof ConfirmPrompt).toBe(true);
    resolve(false);
    expect(owner.hand.cards).toEqual([second, ...drawn]);
    expect(owner.discard.cards).toEqual([first]);
    expect(opponent.active.getPokemonCard()?.fullName).toBe(mew);
    expect(pending()).toBeUndefined();
  });

  it('chooses the opponent switch when both Custom Catcher modes are legal', () => {
    const { owner, opponent } = open({ hand: [catcher, catcher], bench: [{ card: naga }] }, { bench: [{ card: dedenne }] });
    play();
    resolve(true);
    resolve([foeBench]);
    expect(owner.deck.cards.length).toBe(3);
    expect(owner.active.getPokemonCard()?.fullName).toBe(finneon);
    expect(opponent.active.getPokemonCard()?.fullName).toBe(dedenne);
    expect(pending()).toBeUndefined();
  });

  it('can draw from the last card with one Custom Catcher', () => {
    const { owner } = open({ hand: [catcher], deck: [fire] });
    play();
    expect(owner.hand.cards.map(card => card.fullName)).toEqual([fire]);
    expect(owner.deck.cards).toEqual([]);
  });

  it('can use only the draw when the opponent has no Bench', () => {
    const { owner } = open({ hand: [catcher, catcher] });
    play();
    expect(owner.hand.cards.map(card => card.fullName)).toEqual([catcher, water, fire]);
    expect(pending()).toBeUndefined();
  });

  for (const hand of [[catcher, water, fire, psychic], [catcher, catcher, water, fire]]) {
    it(`rejects Custom Catcher when no legal effect exists (${hand.filter(card => card === catcher).length} copies)`, () => {
      const { owner } = open({ hand });
      expect(play).toThrow();
      expect(owner.hand.cards.map(card => card.fullName)).toEqual(hand);
      expect(owner.discard.cards).toEqual([]);
      expect(pending()).toBeUndefined();
    });
  }

  it('preserves the original hand index and other staged cards when rejecting an Item', () => {
    const { owner } = open({ hand: [water, catcher, fire, psychic] });
    const [staged] = owner.deck.cards.splice(0, 1);
    owner.supporter.cards.push(staged);
    const originals = [...owner.hand.cards];
    expect(() => store.dispatch(new PlayCardAction(owner.id, 1, board))).toThrow();
    expect(owner.hand.cards).toEqual(originals);
    expect(owner.supporter.cards).toEqual([staged]);
  });

  it('uses two Cross Switchers and switches the opponent and then the player', () => {
    const { owner, opponent } = open({ hand: [cross, cross], bench: [{ card: naga }] }, { bench: [{ card: dedenne }] });
    play();
    resolve([foeBench]);
    expect(owner.active.getPokemonCard()?.fullName).toBe(finneon);
    expect(opponent.active.getPokemonCard()?.fullName).toBe(dedenne);
    resolve([bench]);
    expect(owner.active.getPokemonCard()?.fullName).toBe(naga);
    expect(owner.discard.cards.map(card => card.fullName)).toEqual([cross, cross]);
  });

  it('still switches the opponent with two Cross Switchers if the player has no Bench', () => {
    const { owner, opponent } = open({ hand: [cross, cross] }, { bench: [{ card: dedenne }] });
    play();
    resolve([foeBench]);
    expect(opponent.active.getPokemonCard()?.fullName).toBe(dedenne);
    expect(owner.active.getPokemonCard()?.fullName).toBe(finneon);
    expect(owner.discard.cards.map(card => card.fullName)).toEqual([cross, cross]);
    expect(pending()).toBeUndefined();
  });

  it('lets one Puzzle of Time order a two-card deck', () => {
    const { owner } = open({ hand: [puzzle], deck: [water, fire] });
    play();
    expect(pending() instanceof OrderCardsPrompt).toBe(true);
    resolve([1, 0]);
    expect(owner.deck.cards.map(card => card.fullName)).toEqual([fire, water]);
    expect(owner.discard.cards.map(card => card.fullName)).toEqual([puzzle]);
  });

  it('recovers one available discard card when the deck is empty and the player has two Puzzle of Time', () => {
    const { owner } = open({ hand: [puzzle, puzzle], deck: [], discard: [fire] });
    play();
    const prompt = pending() as ChooseCardsPrompt;
    expect(prompt instanceof ChooseCardsPrompt).toBe(true);
    expect(prompt.cards.cards.map(card => card.fullName)).toEqual([fire]);
    expect(prompt.options.min).toBe(1);
    resolve([0]);
    if (pending() instanceof ShowCardsPrompt) resolve(true);
    expect(owner.hand.cards.map(card => card.fullName)).toEqual([fire]);
    expect(owner.discard.cards.map(card => card.fullName)).toEqual([puzzle, puzzle]);
    expect(owner.supporter.cards).toEqual([]);
  });

  it('requires both selected cards and shields the played Puzzle of Time copies from recovery', () => {
    const { owner } = open({ hand: [puzzle, puzzle], discard: [puzzle, fire, psychic] });
    const previous = [...owner.discard.cards];
    play();
    expect(pending() instanceof SelectOptionPrompt).toBe(true);
    resolve(1);
    const prompt = pending() as ChooseCardsPrompt;
    expect(prompt.cards.cards).toEqual(previous);
    expect(prompt.validate([previous[0]])).toBe(false);
    resolve([0, 2]);
    if (pending() instanceof ShowCardsPrompt) resolve(true);
    expect(owner.hand.cards).toEqual([previous[0], previous[2]]);
    expect(owner.discard.cards.map(card => card.fullName)).toEqual([fire, puzzle, puzzle]);
  });

  it('does not consume two Puzzle of Time if neither mode is legal', () => {
    const { owner } = open({ hand: [puzzle, puzzle], deck: [] });
    const originals = [...owner.hand.cards];
    expect(play).toThrow();
    expect(owner.hand.cards).toEqual(originals);
  });

  it('chooses exactly one Special Condition when playing one Mixed Herbs', () => {
    const { owner } = open({ hand: [herbs, herbs], active: { card: mew, damage: 100 } });
    owner.active.addSpecialCondition(SpecialCondition.POISONED);
    owner.active.addSpecialCondition(SpecialCondition.ASLEEP);
    play();
    expect(pending() instanceof ConfirmPrompt).toBe(true);
    resolve(false);
    expect((pending() as SelectPrompt).values).toEqual([
      'GAME_MESSAGES.SPECIAL_CONDITION_POISONED', 'GAME_MESSAGES.SPECIAL_CONDITION_ASLEEP',
    ]);
    resolve(1);
    expect(owner.active.specialConditions).toEqual([SpecialCondition.POISONED]);
    expect(owner.active.damage).toBe(100);
    expect(owner.hand.cards.map(card => card.fullName)).toEqual([herbs]);
  });

  it('cures all conditions and heals 90 damage with two Mixed Herbs', () => {
    const { owner } = open({ hand: [herbs, herbs], active: { card: mew, damage: 100 } });
    owner.active.addSpecialCondition(SpecialCondition.POISONED);
    owner.active.addSpecialCondition(SpecialCondition.BURNED);
    play();
    resolve(true);
    expect(owner.active.specialConditions).toEqual([]);
    expect(owner.active.damage).toBe(10);
    expect(owner.discard.cards.map(card => card.fullName)).toEqual([herbs, herbs]);
  });

  it('requires both Mixed Herbs to heal damage alone', () => {
    const { owner } = open({ hand: [herbs, herbs], active: { card: mew, damage: 100 } });
    play();
    expect(owner.active.damage).toBe(10);
    expect(owner.discard.cards.length).toBe(2);
    expect(pending()).toBeUndefined();
  });

  it('rejects a single Mixed Herbs with only damage', () => {
    const { owner } = open({ hand: [herbs], active: { card: mew, damage: 20 } });
    expect(play).toThrow();
    expect(owner.hand.cards.map(card => card.fullName)).toEqual([herbs]);
  });

  it('allows four Quad Stone to heal the Bench when the Active has full HP', () => {
    const { owner } = open({ hand: Array(4).fill(stone), bench: [{ card: mew, damage: 80 }] });
    play();
    expect(owner.bench[0].damage).toBe(0);
    expect(owner.discard.cards.length).toBe(4);
    expect(pending()).toBeUndefined();
  });

  it('allows the one-Quad Stone mode even when four are in hand', () => {
    const { owner } = open({ hand: Array(4).fill(stone), active: { card: mew, damage: 30 }, bench: [{ card: finneon, damage: 20 }] });
    play();
    expect(pending() instanceof SelectOptionPrompt).toBe(true);
    resolve(0);
    expect(owner.active.damage).toBe(20);
    expect(owner.bench[0].damage).toBe(20);
    expect(owner.hand.cards.length).toBe(3);
  });

  it('does not let a Quad Stone be played for no effect', () => {
    const { owner } = open({ hand: Array(4).fill(stone) });
    expect(play).toThrow();
    expect(owner.hand.cards.length).toBe(4);
  });

  it('chooses the prize taken with four Missing Clover even if the deck is empty', () => {
    const { owner } = open({ hand: Array(4).fill(clover), deck: [], prizeCount: 2 });
    const prize = owner.prizes[1].cards[0];
    play();
    expect(pending() instanceof ChoosePrizePrompt).toBe(true);
    resolve([1]);
    expect(owner.hand.cards).toEqual([prize]);
    expect(owner.getPrizeLeft()).toBe(1);
    expect(owner.discard.cards.map(card => card.fullName)).toEqual(Array(4).fill(clover));
  });

  it('allows one Missing Clover to look privately without taking or moving the top card', () => {
    const { owner } = open({ hand: Array(4).fill(clover) });
    const originalDeck = [...owner.deck.cards];
    play();
    resolve(false);
    const prompt = pending() as ShowCardsPrompt;
    expect(prompt instanceof ShowCardsPrompt).toBe(true);
    expect(prompt.playerId).toBe(owner.id);
    expect(prompt.cards).toEqual([originalDeck[0]]);
    resolve(true);
    expect(owner.deck.cards).toEqual(originalDeck);
    expect(owner.hand.cards.length).toBe(3);
    expect(owner.discard.cards.length).toBe(1);
  });

  it('attaches two Basic Energy to a single Ultra Beast and actually shuffles the remaining deck', () => {
    const { owner } = open({ hand: [ring], deck: [water, fire, mew, psychic], bench: [{ card: naga }, { card: poipole }] },
      { prizeCount: 4, active: { card: 'Goodra FST 197' } });
    play();
    const prompt = pending() as AttachEnergyPrompt;
    expect(prompt instanceof AttachEnergyPrompt).toBe(true);
    const split = [{ index: 0, to: bench }, { index: 1, to: { ...bench, index: 1 } }];
    expect(prompt.validate(prompt.decode(split, store.state))).toBe(false);
    resolve([{ index: 0, to: bench }, { index: 1, to: bench }]);
    expect(owner.bench[0].energies.cards.map(card => card.fullName)).toEqual([water, fire]);
    expect(owner.energyPlayedTurn).not.toBe(5);
    expect(pending() instanceof ShuffleDeckPrompt).toBe(true);
    resolve([1, 0]);
    expect(owner.deck.cards.map(card => card.fullName)).toEqual([psychic, mew]);
    expect(owner.discard.cards.map(card => card.fullName)).toEqual([ring]);
  });

  it('shuffles after a zero-card Beast Ring search when the deck has cards', () => {
    const { owner } = open({ hand: ['Beast Ring2 FLI'], bench: [{ card: naga }], deck: [mew, dedenne] }, { prizeCount: 3 });
    play();
    resolve([]);
    expect(pending() instanceof ShuffleDeckPrompt).toBe(true);
    resolve([1, 0]);
    expect(owner.deck.cards.map(card => card.fullName)).toEqual([dedenne, mew]);
    expect(owner.bench[0].energies.cards).toEqual([]);
    expect(owner.discard.cards.length).toBe(1);
  });

  for (const [benchCards, deck, prizes] of [
    [[{ card: naga }], basicDeck, 2], [[{ card: naga }], basicDeck, 5], [[{ card: finneon }], basicDeck, 3],
    [[{ card: naga }], [], 4],
  ] as const) {
    it(`rejects Beast Ring without legal prizes, an Ultra Beast and a deck (${benchCards[0].card}, ${deck.length}, ${prizes})`, () => {
      const { owner } = open({ hand: [ring], bench: [...benchCards], deck: [...deck] }, { prizeCount: prizes });
      expect(play).toThrow();
      expect(owner.hand.cards.map(card => card.fullName)).toEqual([ring]);
      expect(pending()).toBeUndefined();
    });
  }
});
