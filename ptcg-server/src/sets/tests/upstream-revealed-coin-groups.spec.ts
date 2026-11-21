import { ensureClientCards } from '../../client/cards';
import { GameLog, GameMessage } from '../../game/game-message';
import { AttackAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { ChooseAttackPrompt } from '../../game/store/prompts/choose-attack-prompt';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { Store } from '../../game/store/store';
import { padDeck, PlayerConfig, setupGame } from './test-helpers';

const water = 'Water Energy SVE';
const grass = 'Grass Energy SVE';
const darkness = 'Darkness Energy SVE';
const hoppip = 'Hoppip EVS';
const ilima = 'Ilima SUM';
const octillery = 'Octillery PL';
const victini = 'Victini GRI';
const sableye = 'Sableye AOR';
const opponent = 'Regigigas ASR';
const assist = { card: 'Liepard BCR', energy: [darkness, water, water] };
const waterVein = 'Water Vein';
const bewitchingEyes = 'Bewitching Eyes';
const deckWithTwo = [water, hoppip, grass, hoppip, hoppip, darkness];
let store: Store;
let random: jasmine.Spy;

beforeAll(ensureClientCards);
beforeEach(() => { random = spyOn(Math, 'random').and.returnValue(0.1); });
afterEach(() => store?.cleanup());

function start(player1: PlayerConfig, player2: PlayerConfig = { active: { card: opponent } }) {
  const game = setupGame({
    turn: 5,
    player1: { deck: padDeck(10), ...player1 },
    player2: { deck: padDeck(10), ...player2 },
  });
  game.store.cleanup();
  store = new Store({ onStateChange: () => undefined });
  store.state = game.state;
  return game;
}

function pending() { return store.state.prompts.find(prompt => prompt.result === undefined); }

function resolve(raw: unknown) {
  const prompt = pending();
  if (!prompt) throw new Error('Expected a pending prompt');
  const result = prompt.decode(raw, store.state);
  if (!prompt.validate(result, store.state)) throw new Error(`Invalid result for ${prompt.type}`);
  store.dispatch(new ResolvePromptAction(prompt.id, result));
}

function attack(name: string) { store.dispatch(new AttackAction(store.state.players[0].id, name)); }

function coin(playerId: number, wantHeads: boolean, nextHeads = wantHeads) {
  const prompt = pending();
  if (!(prompt instanceof WaitPrompt) || prompt.message !== 'Coin flip animation') throw new Error('Expected a coin flip');
  expect(prompt.playerId).toBe(playerId);
  random.and.returnValue(nextHeads ? 0.1 : 0.9);
  const logIndex = store.state.logs.length;
  resolve(true);
  const flips = store.state.logs.slice(logIndex).filter(log =>
    log.message === GameLog.LOG_PLAYER_FLIPS_HEADS || log.message === GameLog.LOG_PLAYER_FLIPS_TAILS);
  expect(flips.map(log => log.message)).toEqual([wantHeads ? GameLog.LOG_PLAYER_FLIPS_HEADS : GameLog.LOG_PLAYER_FLIPS_TAILS]);
}

function animations() {
  while (pending() instanceof WaitPrompt && (pending() as WaitPrompt).message !== 'Coin flip animation') resolve(true);
}

function finish() {
  animations();
  expect(pending()).toBeUndefined();
  expect(store.state.turn).toBe(6);
}

function chooseCopy(name: string, bench = 0) {
  expect(pending() instanceof ChoosePokemonPrompt).toBe(true);
  resolve([{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: bench }]);
  expect(pending() instanceof ChooseAttackPrompt).toBe(true);
  resolve({ index: 0, attack: name });
}

function reveal(expected: string[]) {
  for (const player of store.state.players) {
    const show = pending();
    if (!(show instanceof ShowCardsPrompt)) throw new Error(`Expected ${player.id}'s reveal, got ${show?.type}`);
    expect(show.playerId).toBe(player.id);
    expect(show.sourcePlayerId).toBe(store.state.players[0].id);
    expect(show.cards.map(card => card.fullName)).toEqual(expected);
    if (player === store.state.players[0]) {
      expect(store.state.prompts.some(prompt => prompt instanceof WaitPrompt && prompt.result === undefined && prompt.message === 'Coin flip animation')).toBe(false);
    }
    resolve(true);
  }
}

function shuffle(count: number, reverse = false) {
  const prompt = pending();
  if (!(prompt instanceof ShuffleDeckPrompt)) throw new Error(`Expected a shuffle, got ${prompt?.type}`);
  const order = Array.from({ length: count }, (_, index) => index);
  resolve(reverse ? order.reverse() : order);
}

function reflip(accept: boolean) {
  const prompt = pending();
  if (!(prompt instanceof ConfirmPrompt) || prompt.message !== GameMessage.WANT_TO_REFLIP_ATTACK_COINS) {
    throw new Error(`Expected a reflip decision, got ${prompt?.type}`);
  }
  expect(prompt.playerId).toBe(store.state.players[0].id);
  resolve(accept);
}

function chooseSupporter() {
  const prompt = pending();
  if (!(prompt instanceof ChooseCardsPrompt)) throw new Error('Expected a Supporter choice');
  resolve([0]);
}

it('Water Vein reveals five before rolling and returns them after dealing damage', () => {
  const { player1, player2 } = start({ active: { card: octillery }, deck: deckWithTwo });
  const physicalCards = [...player1.deck.cards];
  attack(waterVein);
  reveal(deckWithTwo.slice(0, 5));
  coin(player1.id, true, false);
  coin(player1.id, false);
  expect(player2.active.damage).toBe(0);
  animations();
  expect(player2.active.damage).toBe(50);
  expect(player1.deck.cards).toEqual(jasmine.arrayWithExactContents(physicalCards));
  shuffle(6);
  finish();
});

it('Water Vein reveals a short deck and still shuffles when no Energy was revealed', () => {
  const cards = [hoppip, 'Nest Ball SVI', 'Crispin SCR'];
  const { player1, player2 } = start({ active: { card: octillery }, deck: cards });
  attack(waterVein);
  reveal(cards);
  animations();
  expect(player2.active.damage).toBe(0);
  expect(player1.deck.cards.map(card => card.fullName)).toEqual(cards);
  shuffle(3, true);
  expect(player1.deck.cards.map(card => card.fullName)).toEqual([...cards].reverse());
  finish();
});

it('Water Vein can be used with an empty deck', () => {
  const { player1, player2 } = start({ active: { card: octillery }, deck: [] });
  expect(player1.deck.cards.length).toBe(0);
  attack(waterVein);
  finish();
  expect(player2.active.damage).toBe(0);
  expect(store.state.prompts.some(prompt => prompt instanceof ShowCardsPrompt || prompt instanceof ShuffleDeckPrompt)).toBe(false);
});

it('direct Water Vein rerolls both coins from a single reveal', () => {
  const { player1, player2 } = start({ active: { card: octillery }, bench: [{ card: victini }], deck: deckWithTwo });
  random.and.returnValue(0.9);
  attack(waterVein);
  reveal(deckWithTwo.slice(0, 5));
  coin(player1.id, false);
  coin(player1.id, false, true);
  reflip(true);
  coin(player1.id, true);
  coin(player1.id, true);
  animations();
  expect(player2.active.damage).toBe(100);
  shuffle(6);
  finish();
  expect(store.state.prompts.filter(prompt => prompt instanceof ShowCardsPrompt).length).toBe(2);
});

for (const choice of ['keep', 'restart on heads', 'restart on tails'] as const) {
  it(`Assist can ${choice} after Water Vein's reveal and coin group`, () => {
    const { player1, player2 } = start({ active: assist,
      bench: [{ card: octillery }, { card: 'Trapinch BCR' }, { card: victini }], deck: deckWithTwo });
    const physicalCards = [...player1.deck.cards];
    attack('Assist');
    coin(player1.id, true);
    reflip(false);
    chooseCopy(waterVein);
    reveal(deckWithTwo.slice(0, 5));
    coin(player1.id, true, false);
    coin(player1.id, false, choice !== 'restart on tails');
    expect(player1.deck.cards).toEqual(physicalCards);
    expect(player2.active.damage).toBe(0);
    reflip(choice !== 'keep');
    if (choice === 'keep') {
      expect(player2.active.damage).toBe(50);
      expect(player1.deck.cards).toEqual(jasmine.arrayWithExactContents(physicalCards));
      shuffle(6);
    } else {
      coin(player1.id, choice === 'restart on heads');
      if (choice === 'restart on heads') chooseCopy('Hyper Beam', 1);
    }
    finish();
    expect(player2.active.damage).toBe(choice === 'keep' ? 50 : choice === 'restart on heads' ? 20 : 0);
    expect(store.state.prompts.filter(prompt => prompt instanceof ShuffleDeckPrompt).length).toBe(choice === 'keep' ? 1 : 0);
    if (choice !== 'keep') expect(player1.deck.cards).toEqual(physicalCards);
  });
}

it('Bewitching Eyes replaces both Ilima coins before either player draws', () => {
  const { player1, player2 } = start({ active: { card: sableye, energy: [darkness] },
    bench: [{ card: victini }], hand: [hoppip] }, { active: { card: opponent }, hand: [grass], discard: [ilima] });
  const source = player2.discard.cards[0];
  player1.supporterTurn = 5;
  random.and.returnValue(0.9);
  attack(bewitchingEyes);
  chooseSupporter();
  expect(store.state.prompts.some(prompt => prompt instanceof WaitPrompt && prompt.result === undefined && prompt.message === 'Coin flip animation')).toBe(false);
  shuffle(11);
  shuffle(11);
  coin(player1.id, false);
  expect(player1.hand.cards.length).toBe(0);
  expect(player2.hand.cards.length).toBe(0);
  coin(player2.id, false, true);
  reflip(true);
  coin(player1.id, true, false);
  coin(player2.id, false);
  expect(player1.hand.cards.length).toBe(6);
  expect(player2.hand.cards.length).toBe(3);
  expect(player1.supporterTurn).toBe(5);
  expect(player2.discard.cards).toEqual([source]);
  expect(store.state.prompts.filter(prompt => prompt instanceof ShuffleDeckPrompt).length).toBe(2);
  finish();
});

it('abandoning copied Bewitching Eyes restores both original hands and deck orders', () => {
  const { player1, player2 } = start({ active: assist, bench: [{ card: sableye }, { card: victini }], hand: [hoppip] },
    { active: { card: opponent }, hand: [grass], discard: [ilima] });
  const ownDeck = [...player1.deck.cards];
  const opposingDeck = [...player2.deck.cards];
  const source = player2.discard.cards[0];
  attack('Assist');
  coin(player1.id, true);
  reflip(false);
  chooseCopy(bewitchingEyes);
  chooseSupporter();
  shuffle(11, true);
  shuffle(11, true);
  coin(player1.id, true);
  coin(player2.id, true, false);
  expect(player1.hand.cards.map(card => card.fullName)).toEqual([hoppip]);
  expect(player2.hand.cards.map(card => card.fullName)).toEqual([grass]);
  reflip(true);
  coin(player1.id, false);
  finish();
  expect(player1.deck.cards).toEqual(ownDeck);
  expect(player2.deck.cards).toEqual(opposingDeck.slice(1));
  expect(player2.hand.cards.map(card => card.fullName)).toEqual([grass, opposingDeck[0].fullName]);
  expect(player2.discard.cards).toEqual([source]);
});

it('Ilima played as a Supporter still shuffles and draws for both players without Victory Star', () => {
  const { player1, player2 } = start({ active: { card: sableye }, bench: [{ card: victini }], hand: [ilima, hoppip] },
    { active: { card: opponent }, hand: [grass] });
  store.dispatch(new PlayCardAction(player1.id, 0, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0 }));
  shuffle(11);
  shuffle(11);
  coin(player1.id, true, false);
  coin(player2.id, false);
  expect(pending()).toBeUndefined();
  expect(player1.hand.cards.length).toBe(6);
  expect(player2.hand.cards.length).toBe(3);
  expect(store.state.turn).toBe(5);
});

it('copying Water Vein again after an Assist reflip reveals the same physical cards', () => {
  const { player1, player2 } = start({ active: assist, bench: [{ card: octillery }, { card: victini }], deck: deckWithTwo });
  const originalTop = player1.deck.cards.slice(0, 5);
  attack('Assist');
  coin(player1.id, true);
  reflip(false);
  chooseCopy(waterVein);
  expect((pending() as ShowCardsPrompt).cards.every((card, index) => card === originalTop[index])).toBe(true);
  random.and.returnValue(0.9);
  reveal(deckWithTwo.slice(0, 5));
  coin(player1.id, false);
  coin(player1.id, false, true);
  reflip(true);
  coin(player1.id, true);
  chooseCopy(waterVein);
  expect((pending() as ShowCardsPrompt).cards.every((card, index) => card === originalTop[index])).toBe(true);
  reveal(deckWithTwo.slice(0, 5));
  coin(player1.id, true);
  coin(player1.id, true);
  animations();
  expect(player2.active.damage).toBe(100);
  shuffle(6);
  finish();
  expect(store.state.prompts.filter(prompt => prompt instanceof ShuffleDeckPrompt).length).toBe(1);
});

it('Portrait includes the borrowed Ilima when its owner shuffles their hand', () => {
  const { player1, player2 } = start({ active: { card: 'Smeargle UD' }, bench: [{ card: victini }], hand: [hoppip] },
    { active: { card: opponent }, hand: [ilima, grass] });
  const source = player2.hand.cards[0];
  store.dispatch(new UseAbilityAction(player1.id, 'Portrait', { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 }));
  chooseSupporter();
  expect(player2.hand.cards).toEqual([]);
  expect(player2.deck.cards.includes(source)).toBe(true);
  shuffle(11);
  shuffle(12);
  coin(player1.id, true, false);
  coin(player2.id, false);
  expect(pending()).toBeUndefined();
  expect(player1.hand.cards.length).toBe(6);
  expect(player2.hand.cards.length).toBe(3);
  expect(player2.deck.cards.includes(source)).toBe(true);
});

it('Ilima’s choice preflight does not consume a coin with one-card decks', () => {
  const { player1, player2 } = start({ active: { card: sableye, energy: [darkness] }, deck: [water] },
    { active: { card: opponent }, deck: [grass], discard: [ilima] });
  attack(bewitchingEyes);
  random.calls.reset();
  chooseSupporter();
  expect(random.calls.count()).toBe(1);
  coin(player1.id, true);
  coin(player2.id, true);
  expect(player1.hand.cards.map(card => card.fullName)).toEqual([water]);
  expect(player2.hand.cards.map(card => card.fullName)).toEqual([grass]);
});
