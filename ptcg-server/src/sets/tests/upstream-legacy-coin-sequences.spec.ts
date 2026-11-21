import { ensureClientCards } from '../../client/cards';
import { GameLog, GameMessage } from '../../game/game-message';
import { AttackAction } from '../../game/store/actions/game-actions';
import { CardTarget, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { ChooseAttackPrompt } from '../../game/store/prompts/choose-attack-prompt';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { GameWinner } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { padDeck, PlayerConfig, setupGame } from './test-helpers';

const active: CardTarget = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const opposingBench: CardTarget = { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 };
const water = 'Water Energy SVE';
const fire = 'Fire Energy SVE';
const grass = 'Grass Energy SVE';
const fairy = 'Fairy Energy XY';
const fighting = 'Fighting Energy SVE';
const lightning = 'Lightning Energy SVE';
const metal = 'Metal Energy SVE';
const psychic = 'Psychic Energy SVE';
const luminous = 'Luminous Energy PAL';
const defender = 'Dragapult ex TWM';
const victini = 'Victini GRI';

beforeAll(ensureClientCards);
let store: Store;
afterEach(() => store?.cleanup());

function start(left: PlayerConfig, right: PlayerConfig = { active: { card: defender } }) {
  const game = setupGame({
    turn: 5,
    player1: { bench: [{ card: victini }], deck: padDeck(8), ...left },
    player2: { deck: padDeck(8), ...right },
  });
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

function coins(...outcomes: boolean[]) {
  for (const heads of outcomes) {
    const prompt = pending();
    if (!(prompt instanceof CoinFlipPrompt)) throw new Error('Expected the next coin before a reflip choice');
    expect(prompt.message).toBe(GameMessage.COIN_FLIP);
    resolve(heads);
  }
}

function reflip(playerId: number, accept = true) {
  const prompt = pending();
  expect(prompt instanceof ConfirmPrompt && prompt.message).toBe(GameMessage.WANT_TO_REFLIP_ATTACK_COINS);
  expect(prompt?.playerId).toBe(playerId);
  resolve(accept);
}

const damage = [
  ['Steelix CEC', 'Iron Tail', [metal, water, water, water], 100],
  ['Togepi & Cleffa & Igglybuff-GX CEC', 'Rolling Panic', [fairy, fairy, water], 150],
  ['Infernape DP', 'Meteor Punch', [water], 30],
  ['Hoppip EVS', 'Continuous Spin', [grass], 20],
  ['Rayquaza Star DX', 'Spiral Rush', [fire, lightning], 30],
  ['Pikachu LM', 'Iron Tail', [metal, water], 20],
  ['Dragonair EX', 'Spiral Wave', [lightning, water], 20],
  ['Geodude FO', 'Stone Barrage', [fighting, water], 10],
  ['Gimmighoul2 PAR', 'Continuous Coin Toss', [water], 20],
] as const;

for (const [card, move, energy, result] of damage) {
  it(`${card} settles ${move} from the replacement series only`, () => {
    const { player1, player2 } = start({ active: { card, energy: [...energy] } });
    attack(move);
    coins(true, true, false);
    expect(player2.active.damage).toBe(0);
    reflip(player1.id);
    coins(true, false);
    animations();
    expect(player2.active.damage).toBe(result);
    expect(pending()).toBeUndefined();
  });

  it(`Genome Hacking preserves ${card}'s full ${move} series`, () => {
    const { player1, player2 } = start({ active: { card: 'Mew ex MEW', energy: [water, water, water] } }, { active: { card } });
    attack('Genome Hacking');
    const prompt = pending();
    if (!(prompt instanceof ChooseAttackPrompt)) throw new Error('Expected a copied attack choice');
    resolve({ index: prompt.cards.findIndex(card => card.attacks.some(attack => attack.name === move)), attack: move });
    coins(false);
    reflip(player1.id);
    coins(true, false);
    animations();
    const copiedDamage = card === 'Steelix CEC' ? result - 20 : result;
    expect(player2.active.damage).toBe(copiedDamage);
    expect(pending()).toBeUndefined();
  });
}

it('keeps the original heads if Continuous Spin is declined', () => {
  const { player1, player2 } = start({ active: { card: 'Hoppip EVS', energy: [grass] } });
  attack('Continuous Spin');
  coins(true, true, false);
  reflip(player1.id, false);
  animations();
  expect(player2.active.damage).toBe(40);
});

it('an all-tails replacement deals zero damage on a multiplier', () => {
  const { player1, player2 } = start({ active: { card: 'Hoppip EVS', energy: [grass] } });
  attack('Continuous Spin');
  coins(true, false);
  reflip(player1.id);
  coins(false);
  animations();
  expect(player2.active.damage).toBe(0);
});

for (const [card, move, energy] of [['Magikarp SF', 'Sea Spray', []],
  ['Scorbunny SWSH 244', 'Flaring Dash', [fire]]] as const) {
  it(`${card} draws only for heads in the final series without revealing early`, () => {
    const { player1 } = start({ active: { card, energy: [...energy] }, deck: [grass, fire, water, ...padDeck(7)] });
    attack(move);
    coins(true, true, false);
    expect(player1.hand.cards).toEqual([]);
    reflip(player1.id);
    coins(true, false);
    animations();
    expect(player1.hand.cards.map(card => card.fullName)).toEqual([grass]);
    expect(player1.deck.cards[0].fullName).toBe(fire);
  });
}

const mills = [
  ['Lairon CRZ 88', [metal, metal, water, water], 80, 1],
  ['Gyarados PGO', [water], 0, 2],
  ['Gyarados SF', [water, water], 40, 1],
  ['Tyrantrum M3', [fighting, water], 160, 1],
] as const;
for (const [card, energy, base, mill] of mills) {
  it(`${card} applies Wreak Havoc damage and moves only the final number of cards`, () => {
    const deck = [grass, fire, water, ...padDeck(8)];
    const { player1, player2 } = start({ active: { card, energy: [...energy] } }, { active: { card: defender }, deck });
    attack('Wreak Havoc');
    coins(true, true, false);
    expect(player2.discard.cards).toEqual([]);
    expect(player2.deck.cards.map(card => card.fullName)).toEqual(deck);
    reflip(player1.id);
    coins(true, false);
    animations();
    expect(player2.active.damage).toBe(base);
    expect(player2.discard.cards.map(card => card.fullName)).toEqual(deck.slice(0, mill));
    expect(player2.hand.cards[0].fullName).toBe(deck[mill]);
  });
}

it('Wreak Havoc finishes the original sequence even when the expected count exceeds the remaining deck', () => {
  const { player1, player2 } = start({ active: { card: 'Tyrantrum M3', energy: [fighting, water] } },
    { active: { card: defender }, deck: [grass] });
  attack('Wreak Havoc');
  coins(true, true, false);
  expect(player2.deck.cards.map(card => card.fullName)).toEqual([grass]);
  reflip(player1.id, false);
  animations();
  expect(player2.discard.cards.map(card => card.fullName)).toEqual([grass]);
  const discardLogs = store.state.logs.filter(log => log.message === GameLog.LOG_PLAYER_DISCARDS_CARD);
  expect(discardLogs.map(log => log.params?.effectName)).toEqual(['Wreak Havoc']);
  expect(store.state.winner).toBe(GameWinner.PLAYER_1);
});

it('Dry Up chooses its target before flipping and discards the mandatory final Water count', () => {
  const { player1, player2 } = start({ active: { card: 'Moltres VS2', energy: [fire, fire] } },
    { active: { card: defender, energy: [water] }, bench: [{ card: 'Pikachu ex SSP', energy: [metal, water, luminous] }] });
  attack('Dry Up');
  expect(pending() instanceof ChoosePokemonPrompt).toBe(true);
  resolve([opposingBench]);
  coins(true, false);
  reflip(player1.id);
  coins(true, true, true, false);
  const prompt = pending();
  if (!(prompt instanceof ChooseCardsPrompt)) throw new Error('Expected the Water Energy selection');
  expect(prompt.options.min).toBe(2);
  expect(prompt.options.max).toBe(2);
  expect(prompt.cards.cards.map(card => card.fullName)).toEqual(jasmine.arrayWithExactContents([water, luminous]));
  expect(() => resolve([0])).toThrow();
  resolve([0, 1]);
  animations();
  expect(player2.active.energies.cards.map(card => card.fullName)).toEqual([water]);
  expect(player2.bench[0].energies.cards.map(card => card.fullName)).toEqual([metal]);
  expect(player2.discard.cards.map(card => card.fullName)).toEqual(jasmine.arrayWithExactContents([water, luminous]));
});

it('Dry Up respects Mist Energy on its chosen target', () => {
  const { player1, player2 } = start({ active: { card: 'Moltres VS2', energy: [fire, fire] } },
    { active: { card: defender }, bench: [{ card: 'Pikachu ex SSP', energy: [water, 'Mist Energy TEF'] }] });
  attack('Dry Up');
  resolve([opposingBench]);
  coins(true, false);
  reflip(player1.id, false);
  resolve([0]);
  animations();
  expect(player2.discard.cards).toEqual([]);
  expect(player2.bench[0].energies.cards.map(card => card.fullName)).toEqual([water, 'Mist Energy TEF']);
});

it('Spiral Growth attaches the required available Basic Energy to the actual Pokémon', () => {
  const { player1 } = start({ active: { card: 'Mew ex MEW', energy: [psychic, psychic, psychic] },
    discard: [grass, 'Mist Energy TEF', water] }, { active: { card: 'Rayquaza ex DR' } });
  attack('Genome Hacking');
  resolve({ index: 0, attack: 'Spiral Growth' });
  coins(false);
  reflip(player1.id);
  coins(true, true, true, false);
  const prompt = pending();
  if (!(prompt instanceof AttachEnergyPrompt)) throw new Error('Expected a discard attachment');
  expect(prompt.options.min).toBe(2);
  expect(prompt.options.max).toBe(2);
  expect(() => resolve([{ index: 1, to: active }, { index: 2, to: active }])).toThrow();
  resolve([{ index: 0, to: active }, { index: 2, to: active }]);
  animations();
  expect(player1.active.energies.cards.map(card => card.fullName)).toEqual([psychic, psychic, psychic, grass, water]);
  expect(player1.discard.cards.map(card => card.fullName)).toEqual(['Mist Energy TEF']);
  expect(player1.energyPlayedTurn).toBe(0);
});

it('Spiral Growth opens no attachment prompt on final tails', () => {
  const { player1 } = start({ active: { card: 'Rayquaza ex DR', energy: [water] }, discard: [fire] });
  attack('Spiral Growth');
  coins(true, false);
  reflip(player1.id);
  coins(false);
  animations();
  expect(pending()).toBeUndefined();
  expect(player1.discard.cards.map(card => card.fullName)).toEqual([fire]);
});

it('Horror Bite reveals distinct cards after damage and shuffles exactly once', () => {
  spyOn(Math, 'random').and.returnValue(0.01);
  const { player1, player2 } = start({ active: { card: 'Houndstone M1S', energy: [psychic] } },
    { active: { card: defender }, hand: [fire, grass, water] });
  attack('Horror Bite');
  coins(true, false);
  reflip(player1.id);
  coins(true, true, false);
  animations();
  expect(player2.active.damage).toBe(30);
  const reveal = pending();
  if (!(reveal instanceof ShowCardsPrompt)) throw new Error('Expected one reveal prompt');
  expect(reveal.cards.map(card => card.fullName)).toEqual([fire, grass]);
  expect(reveal.sourcePlayerId).toBe(player2.id);
  expect(player2.hand.cards.map(card => card.fullName)).toEqual([fire, grass, water]);
  resolve(true);
  expect(pending() instanceof ShuffleDeckPrompt).toBe(true);
  resolve(player2.deck.cards.map((_card, index) => index));
  animations();
  expect(pending()).toBeUndefined();
  expect(player2.hand.cards.map(card => card.fullName)).toContain(water);
  expect(player2.deck.cards.map(card => card.fullName)).toEqual(jasmine.arrayContaining([fire, grass]));
  expect(store.state.prompts.filter(prompt => prompt instanceof ShuffleDeckPrompt).length).toBe(1);
});
