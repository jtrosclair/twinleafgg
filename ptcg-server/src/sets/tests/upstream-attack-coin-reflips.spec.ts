import { ensureClientCards } from '../../client/cards';
import { GameLog, GameMessage } from '../../game/game-message';
import { AttackAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { CardTarget, PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { SpecialCondition } from '../../game/store/card/card-types';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { ChooseAttackPrompt } from '../../game/store/prompts/choose-attack-prompt';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { SelectPrompt } from '../../game/store/prompts/select-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { Store } from '../../game/store/store';
import { getCardByName, padDeck, PlayerConfig, setupGame } from './test-helpers';

const active: CardTarget = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const bench: CardTarget = { ...active, slot: SlotType.BENCH };
const water = 'Water Energy SVE';
const psychic = 'Psychic Energy SVE';
const lightning = 'Lightning Energy SVE';
const fighting = 'Fighting Energy SVE';
const defender = 'Mega Kangaskhan ex M1S';
const neutralDefender = 'Charizard ex OBF';
const victini = 'Victini GRI';
const trick = 'Trick Coin PHF';
const badge = 'Retry Badge M5';
const glimwood = 'Glimwood Tangle DAA';
const doubleChop = { card: 'Riolu UL', energy: [fighting, water] };

beforeAll(ensureClientCards);
let store: Store;
afterEach(() => store?.cleanup());

function start(left: PlayerConfig, right: PlayerConfig = { active: { card: neutralDefender } }) {
  const game = setupGame({ turn: 5, player1: { deck: padDeck(8), ...left }, player2: { deck: padDeck(8), ...right } });
  game.store.cleanup();
  store = new Store({ onStateChange: () => undefined });
  store.state = game.state;
  return game;
}

function pending() { return store.state.prompts.find(prompt => prompt.result === undefined); }

function resolve(raw: unknown) {
  const prompt = pending();
  if (!prompt) throw new Error('Expected a prompt');
  const decoded = prompt.decode(raw, store.state);
  if (!prompt.validate(decoded, store.state)) throw new Error(`Invalid result for ${prompt.type}`);
  store.dispatch(new ResolvePromptAction(prompt.id, decoded));
}

function animations() {
  while (pending() instanceof WaitPrompt) resolve(true);
}

function attack(name: string) {
  store.dispatch(new AttackAction(store.state.players[store.state.activePlayer].id, name));
  animations();
}

function submitCoins(results: boolean[]) {
  for (const result of results) {
    expect(pending() instanceof CoinFlipPrompt).toBe(true);
    resolve(result);
  }
}

function resultsFromRandom(results: boolean[]) {
  const remaining = [...results];
  spyOn(Math, 'random').and.callFake(() => remaining.shift() ? 0.01 : 0.99);
}

function expectReflip(playerId: number) {
  const prompt = pending();
  expect(prompt instanceof ConfirmPrompt).toBe(true);
  expect(prompt?.playerId).toBe(playerId);
}

for (const print of [victini, 'Victini NVI 14', 'Victini NVI 98', 'Victini LTR']) {
  it(`${print} replaces the complete typed Double Chop group after the original results`, () => {
    resultsFromRandom([true, true, true, false]);
    const { player1, player2 } = start({ active: doubleChop, bench: [{ card: print }] });
    attack('Double Chop');
    expectReflip(player1.id);
    expect(player2.active.damage).toBe(0);
    resolve(true);
    animations();
    expect(player2.active.damage).toBe(20);
    expect(pending()).toBeUndefined();
    expect(store.state.logs.filter(log => log.message === GameLog.LOG_PLAYER_REFLIPS_WITH_CARD).length).toBe(1);
  });
}

it('offers Victory Star after a single typed attack flip and allows keeping heads', () => {
  spyOn(Math, 'random').and.returnValue(0.01);
  const { player1, player2 } = start({ active: { card: 'Squirtle BS', energy: [water] }, bench: [{ card: victini }] });
  attack('Bubble');
  expectReflip(player1.id);
  resolve(false);
  animations();
  expect(player2.active.damage).toBe(10);
  expect(store.state.logs.filter(log => log.message === GameLog.LOG_PLAYER_FLIPS_HEADS).length).toBe(1);
  expect(store.state.logs.filter(log => log.message === GameLog.LOG_PLAYER_REFLIPS_WITH_CARD).length).toBe(0);
});

it('offers one choice across Trick Coin, Victory Star, and Glimwood Tangle', () => {
  resultsFromRandom([false, false, true, true]);
  const { player1, player2 } = start({ active: { ...doubleChop, tools: [trick] }, bench: [{ card: victini }, { card: 'Victini NVI 14' }] });
  player1.stadium.cards.push(getCardByName(glimwood));
  attack('Double Chop');
  const prompt = pending();
  expect(prompt instanceof SelectPrompt).toBe(true);
  if (!(prompt instanceof SelectPrompt)) return;
  expect(prompt.values).toEqual(jasmine.arrayWithExactContents(['Trick Coin', 'Victory Star', 'Glimwood Tangle']));
  resolve(prompt.values.indexOf('Victory Star'));
  animations();
  expect(player2.active.damage).toBe(40);
  expect(pending()).toBeUndefined();
  expect(store.state.logs.filter(log => log.message === GameLog.LOG_PLAYER_REFLIPS_WITH_CARD).length).toBe(1);
  expect(store.state.logs.filter(log => log.message === GameLog.LOG_PLAYER_REFLIPS_WITH_GLIMWOOD_TANGLE).length).toBe(0);
});

it('lets the turn player reflip the opponent’s Bench Manipulation coins', () => {
  resultsFromRandom([true, true, false, true]);
  const hypno = "Team Rocket's Hypno DRI";
  const { player1, player2 } = start({ active: { card: hypno, energy: [psychic, psychic, psychic], tools: [trick] }, bench: [{ card: victini }] }, {
    active: { card: defender }, bench: [{ card: victini }, { card: 'Pikachu ex SSP' }],
  });
  attack('Bench Manipulation');
  const choice = pending();
  expect(choice instanceof SelectPrompt).toBe(true);
  expect(choice?.playerId).toBe(player1.id);
  if (!(choice instanceof SelectPrompt)) return;
  resolve(choice.values.indexOf('Trick Coin'));
  animations();
  expect(player2.active.damage).toBe(80);
  expect(pending()).toBeUndefined();
});

it('does zero damage and offers no reroll when Bench Manipulation has zero flips', () => {
  const { player2 } = start({ active: { card: "Team Rocket's Hypno DRI", energy: [psychic, psychic, psychic] }, bench: [{ card: victini }] });
  attack('Bench Manipulation');
  expect(player2.active.damage).toBe(0);
  expect(pending()).toBeUndefined();
});

it('uses the complete legacy Rapid-Fire Combo series and retains the original prompt type', () => {
  const { player1, player2 } = start({ active: { card: defender, energy: [water, water, water], tools: [badge] } });
  attack('Rapid-Fire Combo');
  submitCoins([true, true, false]);
  expectReflip(player1.id);
  expect(player2.active.damage).toBe(0);
  resolve(true);
  submitCoins([true, false]);
  animations();
  expect(player2.active.damage).toBe(250);
  expect(pending()).toBeUndefined();
});

it('repeats Rapid-Fire Combo when copied and uses the copycat’s Trick Coin', () => {
  const { player1, player2 } = start({ active: { card: 'Mew ex MEW', energy: [water, water, water], tools: [trick] } },
    { active: { card: defender } });
  attack('Genome Hacking');
  expect(pending() instanceof ChooseAttackPrompt).toBe(true);
  resolve({ index: 0, attack: 'Rapid-Fire Combo' });
  submitCoins([false]);
  expectReflip(player1.id);
  resolve(true);
  submitCoins([true, false]);
  animations();
  expect(player2.active.damage).toBe(250);
  expect(pending()).toBeUndefined();
});

it('does not offer Retry Badge for a Fighting Pokémon, or Trick Coin when attached on the Bench', () => {
  resultsFromRandom([true, true]);
  const { player2 } = start({ active: { ...doubleChop, tools: [badge] }, bench: [{ card: 'Pikachu ex SSP', tools: [trick] }] });
  attack('Double Chop');
  expect(pending()).toBeUndefined();
  expect(player2.active.damage).toBe(40);
});

it('respects active Tool Jammer before offering a reflip Tool', () => {
  resultsFromRandom([true, false]);
  const { player2 } = start({ active: { ...doubleChop, tools: [trick] } }, { active: { card: neutralDefender, tools: ['Tool Jammer BST'] } });
  attack('Double Chop');
  expect(pending()).toBeUndefined();
  expect(player2.active.damage).toBe(20);
});

it('leaves the Confusion check outside all attack reflips', () => {
  const { player1, player2 } = start({ active: { ...doubleChop, tools: [trick] }, bench: [{ card: victini }] });
  player1.stadium.cards.push(getCardByName(glimwood));
  player1.active.addSpecialCondition(SpecialCondition.CONFUSED);
  attack('Double Chop');
  const prompt = pending();
  expect(prompt instanceof CoinFlipPrompt && prompt.message).toBe(GameMessage.FLIP_CONFUSION);
  resolve(false);
  animations();
  expect(pending()).toBeUndefined();
  expect(player1.active.damage).toBe(30);
  expect(player2.active.damage).toBe(0);
});

it('does not activate Victory Star manually or after a regular Trainer coin', () => {
  const { player1 } = start({ active: { card: defender }, bench: [{ card: victini }], hand: ['Crushing Hammer SVI'] },
    { active: { card: defender, energy: [water] } });
  expect(() => store.dispatch(new UseAbilityAction(player1.id, 'Victory Star', bench))).toThrow();
  store.dispatch(new PlayCardAction(player1.id, 0, { ...active, slot: SlotType.BOARD }));
  submitCoins([false]);
  animations();
  expect(pending()).toBeUndefined();
});

it('forces both original and replacement legacy flips to tails on the targeted turn', () => {
  const { player1, player2 } = start({ active: { card: 'Cofagrigus PLF', energy: [psychic, psychic, psychic] } }, {
    active: { card: defender, energy: [water, water, water], tools: [trick] }, bench: [{ card: victini }],
  });
  attack('Slap of Misfortune');
  expect(store.state.players[store.state.activePlayer]).toBe(player2);
  attack('Rapid-Fire Combo');
  const first = pending();
  submitCoins([true]);
  expect(first?.result).toBe(false);
  const choice = pending();
  if (!(choice instanceof SelectPrompt)) throw new Error('Expected reflip choices');
  resolve(choice.values.indexOf('Trick Coin'));
  const second = pending();
  submitCoins([true]);
  expect(second?.result).toBe(false);
  animations();
  if (pending() instanceof ChoosePokemonPrompt) resolve([bench]);
  expect(player1.discard.cards.map(card => card.fullName)).toContain('Cofagrigus PLF');
});

for (const keep of [true, false]) {
  it(`Kaleidowaltz uses only ${keep ? 'the original heads' : 'the replacement results'}`, () => {
    const { player1 } = start({ active: { card: 'Mega Audino ex MC', energy: [water], tools: [badge] },
      deck: [water, lightning, ...padDeck(8)] });
    const order = [...player1.deck.cards];
    attack('Kaleidowaltz');
    submitCoins([true, false, true]);
    expectReflip(player1.id);
    resolve(!keep);
    if (!keep) submitCoins([false, false, false]);
    animations();
    if (keep) {
      const prompt = pending();
      expect(prompt instanceof AttachEnergyPrompt && prompt.options.max).toBe(4);
      resolve([]);
      expect(pending() instanceof ShuffleDeckPrompt).toBe(true);
      resolve(player1.deck.cards.map((_card, index) => index));
      animations();
    } else {
      expect(player1.deck.cards).toEqual(order);
    }
    expect(pending()).toBeUndefined();
  });
}

for (const [first, second, shielded] of [[false, true, false], [true, false, false], [false, true, true]]) {
  it(`Thump-Thump Boom uses the final ${second ? 'heads' : 'tails'}${shielded ? ' with Mist Energy' : ''}`, () => {
    const electrode = "Iono's Electrode JTG";
    const { player1, player2 } = start({ active: { card: electrode, energy: [lightning, lightning] }, bench: [{ card: victini }] },
      { active: { card: defender, energy: shielded ? ['Mist Energy TEF'] : [] }, bench: [{ card: 'Pikachu ex SSP' }] });
    attack('Thump-Thump Boom');
    submitCoins([first]);
    expectReflip(player1.id);
    expect(player1.active.damage).toBe(100);
    expect(player2.active.damage).toBe(0);
    resolve(true);
    submitCoins([second]);
    animations();
    while (pending() instanceof ChoosePokemonPrompt) { resolve([bench]); animations(); }
    expect(player1.discard.cards.map(card => card.fullName)).toContain(electrode);
    expect(player2.discard.cards.some(card => card.fullName === defender)).toBe(second && !shielded);
    expect(pending()).toBeUndefined();
  });
}

it('Remove Lost performs the exact energy move after dealing lethal damage and before awarding a Prize', () => {
  const metal = 'Metal Energy SVE';
  const { player1, player2 } = start({ active: { card: 'Dialga G LV.X PL', energy: [metal, metal, water, water], tools: [trick] } },
    { active: { card: defender, damage: 220, energy: [water, lightning] }, bench: [{ card: 'Pikachu ex SSP' }] });
  attack('Remove Lost');
  submitCoins([false]);
  expectReflip(player1.id);
  resolve(true);
  submitCoins([true, true, false]);
  animations();
  expect(player2.active.damage).toBe(300);
  const prompt = pending();
  expect(prompt instanceof ChooseCardsPrompt && prompt.options.min).toBe(2);
  expect(player1.getPrizeLeft()).toBe(6);
  resolve([0, 1]);
  expect(player2.lostzone.cards.map(card => card.fullName)).toEqual([water, lightning]);
  expect(player1.getPrizeLeft()).toBe(3);
});
