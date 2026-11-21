import { ensureClientCards } from '../../client/cards';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { AttackAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { MoveCardsEffect } from '../../game/store/effects/game-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { Player } from '../../game/store/state/player';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { Store } from '../../game/store/store';
import { getCardByName, padDeck, PlayerConfig, setupGame } from './test-helpers';

const areaZero = 'Area Zero Underdepths SCR';
const skyField = 'Sky Field ROS';
const collapsed = 'Collapsed Stadium BRS';
const giantStump = 'Giant Stump LM';
const terapagos = 'Terapagos ex SCR';
const regigigas = 'Regigigas ASR';
const basic = 'Hoppip EVS';
const charm = 'Bravery Charm PAL';
const fire = 'Fire Energy SVE';
let store: Store;
let uniqueCardId: number;

beforeAll(ensureClientCards);
afterEach(() => store?.cleanup());

function card(name: string) {
  const selected = getCardByName(name);
  selected.id = uniqueCardId++;
  return selected;
}

function start(left: Partial<PlayerConfig>, right: Partial<PlayerConfig>, stadium: string, owner: number, active = 0) {
  const game = setupGame({
    turn: 5,
    player1: { active: { card: regigigas }, deck: padDeck(10), ...left },
    player2: { active: { card: regigigas }, deck: padDeck(10), ...right },
  });
  uniqueCardId = 800;
  game.store.cleanup();
  game.state.activePlayer = active;
  game.state.players[owner].stadium.cards = [card(stadium)];
  for (const player of game.state.players) {
    while (player.bench.length < 8) {
      const slot = new PokemonCardList();
      slot.isPublic = true;
      player.bench.push(slot);
    }
    for (const slot of player.bench) {
      if (!slot.cards.length) slot.cards = [card(basic)];
    }
  }
  store = new Store({ onStateChange: () => undefined });
  store.state = game.state;
  return game;
}

function currentPrompt() { return store.state.prompts.find(prompt => prompt.result === undefined); }

function resolve(raw: unknown) {
  const prompt = currentPrompt();
  if (!prompt) throw new Error('Expected a pending prompt');
  const result = prompt.decode(raw, store.state);
  if (!prompt.validate(result, store.state)) throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
  store.dispatch(new ResolvePromptAction(prompt.id, result));
}

function animate() {
  while (currentPrompt() instanceof WaitPrompt) resolve(true);
}

function selectBench(indices: number[], playerType = PlayerType.BOTTOM_PLAYER) {
  resolve(indices.map(index => ({ player: playerType, slot: SlotType.BENCH, index })));
}

function play() {
  const player = store.state.players[store.state.activePlayer];
  store.dispatch(new PlayCardAction(player.id, 0, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0 }));
  animate();
}

function expectReduction(player: Player, amount: number) {
  const prompt = currentPrompt();
  if (!(prompt instanceof ChoosePokemonPrompt)) throw new Error('Expected a Bench discard prompt');
  expect(prompt.message).toBe(GameMessage.CHOOSE_POKEMON_TO_DISCARD);
  expect(prompt.playerId).toBe(player.id);
  expect(prompt.options.min).toBe(amount);
  expect(prompt.options.max).toBe(amount);
  expect(store.state.prompts.filter(candidate => candidate.result === undefined).length).toBe(1);
}

function benchSizes() { return store.state.players.map(player => player.bench.length); }

for (const [incoming, outgoing, actor, count] of [
  [collapsed, areaZero, 0, 4],
  [collapsed, areaZero, 1, 4],
  [giantStump, skyField, 1, 5],
] as const) {
  it(`collects both choices before discarding after ${incoming} replaces ${outgoing} for player ${actor + 1}`, () => {
    const playing = { active: { card: terapagos }, hand: [incoming] };
    const waiting = { active: { card: terapagos } };
    const { state } = start(actor ? waiting : playing, actor ? playing : waiting, outgoing, 1 - actor, actor);
    const [owner, other] = [state.players[actor], state.players[1 - actor]];
    const ownerPokemon = owner.bench[0].getPokemonCard()!;
    const otherPokemon = card('Jirachi ◇ CES');
    other.bench[0].cards = [otherPokemon];
    const indexedEnergy = card(fire);
    owner.bench[0].energies.cards.push(indexedEnergy);
    const oldLength = owner.getPrizeLeft();
    const observe = store.reduceEffect.bind(store);
    let sawDiscard = false;
    spyOn(store, 'reduceEffect').and.callFake((board: State, effect: Effect) => {
      if (effect instanceof MoveCardsEffect
        && (effect.source.cards.includes(ownerPokemon) || effect.source.cards.includes(otherPokemon))) {
        sawDiscard = true;
        expect(owner.getPokemonInPlay().some(slot => slot.getPokemonCard() === ownerPokemon)).toBe(false);
        expect(other.getPokemonInPlay().some(slot => slot.getPokemonCard() === otherPokemon)).toBe(false);
      }
      return observe(board, effect);
    });

    play();
    expectReduction(owner, count);
    selectBench(Array.from({ length: count }, (_, index) => index));
    expectReduction(other, count);
    expect(benchSizes()).toEqual([8, 8]);
    expect(owner.bench[0].getPokemonCard()).toBe(ownerPokemon);
    expect(owner.discard.cards).not.toContain(ownerPokemon);
    expect(other.lostzone.cards).not.toContain(otherPokemon);

    selectBench(Array.from({ length: count }, (_, index) => index));
    animate();
    expect(sawDiscard).toBe(true);
    expect(benchSizes()).toEqual([8 - count, 8 - count]);
    expect(owner.discard.cards).toContain(ownerPokemon);
    expect(owner.discard.cards.filter(piece => piece === indexedEnergy).length).toBe(1);
    expect(other.lostzone.cards).toContain(otherPokemon);
    expect(other.discard.cards).not.toContain(otherPokemon);
    expect(owner.getPrizeLeft()).toBe(oldLength);
    expect(currentPrompt()).toBeUndefined();
  });
}

it('keeps the prompt open when duplicate slots or the opposing Bench are submitted', () => {
  const { player1 } = start({ active: { card: terapagos }, hand: [collapsed] },
    { active: { card: terapagos } }, areaZero, 1);
  play();
  const prompt = currentPrompt();
  expect(() => selectBench([0, 0, 1, 2])).toThrow(new GameError(GameMessage.INVALID_PROMPT_RESULT));
  expect(() => selectBench([0, 1, 2, 3], PlayerType.TOP_PLAYER)).toThrow(new GameError(GameMessage.INVALID_PROMPT_RESULT));
  expect(currentPrompt()).toBe(prompt);
  expect(player1.bench.length).toBe(8);
  expect(player1.discard.cards).toEqual([]);
  selectBench([0, 1, 2, 3]);
  selectBench([0, 1, 2, 3]);
  expect(benchSizes()).toEqual([4, 4]);
});

it('lets the former Area Zero owner choose first after Lost Vacuum sends it to the Lost Zone', () => {
  const { player1, player2 } = start({ active: { card: terapagos }, hand: ['Lost Vacuum LOR', fire] },
    { active: { card: terapagos } }, areaZero, 1);
  play();
  const cost = currentPrompt();
  if (!(cost instanceof ChooseCardsPrompt)) throw new Error('Expected Lost Vacuum’s hand cost');
  resolve([cost.cards.cards.findIndex(piece => piece.fullName === fire)]);
  animate();
  expectReduction(player2, 3);
  expect(player2.lostzone.cards.some(piece => piece.fullName === areaZero)).toBe(true);
  selectBench([0, 1, 2]);
  expectReduction(player1, 3);
  expect(benchSizes()).toEqual([8, 8]);
  selectBench([0, 1, 2]);
  expect(benchSizes()).toEqual([5, 5]);
  expect(currentPrompt()).toBeUndefined();
});

it('lets the former Sky Field owner choose first when Wreck discards it before promotion', () => {
  const { player1, player2 } = start({
    active: { card: 'Primeape TEU', energy: ['Fighting Energy SVE', fire, fire] },
  }, {}, skyField, 1);
  store.dispatch(new AttackAction(player1.id, 'Wreck'));
  animate();
  expectReduction(player2, 3);
  selectBench([0, 1, 2]);
  expectReduction(player1, 3);
  expect(benchSizes()).toEqual([8, 8]);
  selectBench([0, 1, 2]);
  animate();
  expect(benchSizes()).toEqual([5, 5]);
  expect(player1.prizesTaken).toBe(1);
  const promotion = currentPrompt();
  expect(promotion instanceof ChoosePokemonPrompt && promotion.message).toBe(GameMessage.CHOOSE_NEW_ACTIVE_POKEMON);
  selectBench([0]);
  animate();
  expect(player2.active.getPokemonCard()?.fullName).toBe(basic);
});

for (const discardTerapagos of [true, false]) {
  it(`checks Megaton Blower’s lethal HP change after Bench discards (discard Terapagos: ${discardTerapagos})`, () => {
    const { player1, player2 } = start({ hand: ['Megaton Blower SSP'] }, {
      bench: [{ card: terapagos, damage: 230, tools: [charm] }],
    }, areaZero, 1);
    player1.bench.splice(5);
    const target = player2.bench[0];
    const original = target.getPokemonCard()!;
    const attachment = target.tools[0];
    if (!discardTerapagos) target.cards = target.cards.filter(piece => piece !== attachment);
    play();
    expectReduction(player2, 3);
    expect(player2.bench[0].getPokemonCard()).toBe(original);
    expect(player1.prizesTaken).toBe(0);
    selectBench(discardTerapagos ? [0, 1, 2] : [1, 2, 3]);
    animate();
    expect(player1.prizesTaken).toBe(discardTerapagos ? 0 : 2);
    expect(player2.discard.cards).toContain(original);
    expect(player2.discard.cards.filter(piece => piece === attachment).length).toBe(1);
    expect(target.tools).not.toContain(attachment);
    expect(player2.bench.length).toBe(5);
    expect(currentPrompt()).toBeUndefined();
  });
}

it('lets a de-evolved last Tera be discarded before its lowered HP can cause a Knock Out', () => {
  const { player1, player2 } = start({
    active: { card: regigigas, energy: [fire], tools: ['Technical Machine: Devolution PAR'] },
  }, { bench: [{ card: 'Cinderace ex SCR', damage: 310 }] }, areaZero, 1);
  player1.bench.splice(5);
  const lower = card('Raboot SCR');
  player2.bench[0].cards.unshift(lower);
  store.dispatch(new AttackAction(player1.id, 'Devolution'));
  animate();
  expectReduction(player2, 3);
  expect(player2.bench[0].getPokemonCard()?.id).toBe(lower.id);
  expect(player1.prizesTaken).toBe(0);
  selectBench([0, 1, 2]);
  animate();
  expect(player2.discard.cards).toContain(lower);
  expect(player2.hand.cards.some(piece => piece.fullName === 'Cinderace ex SCR')).toBe(true);
  expect(player2.bench.length).toBe(5);
  expect(player1.prizesTaken).toBe(0);
  expect(currentPrompt()).toBeUndefined();
});
