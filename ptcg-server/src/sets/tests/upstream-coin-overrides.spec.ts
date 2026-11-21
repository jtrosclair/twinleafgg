import { ensureClientCards } from '../../client/cards';
import { GameLog, GameMessage } from '../../game/game-message';
import { AttackAction, PassTurnAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { SpecialCondition } from '../../game/store/card/card-types';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { ChooseAttackPrompt } from '../../game/store/prompts/choose-attack-prompt';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { StateLog } from '../../game/store/state/state-log';
import { Store } from '../../game/store/store';
import { padDeck, PlayerConfig, setupGame } from './test-helpers';

const water = 'Water Energy SVE';
const grass = 'Grass Energy SVE';
const fighting = 'Fighting Energy SVE';
const overridePrints = ['Malamar XYP', 'Shiftry RR'];

beforeAll(ensureClientCards);
let store: Store;
afterEach(() => store?.cleanup());

function start(left: PlayerConfig, right: PlayerConfig) {
  const game = setupGame({ turn: 5, player1: { deck: padDeck(8), ...left },
    player2: { deck: padDeck(8), ...right } });
  game.store.cleanup();
  store = new Store({ onStateChange: () => undefined });
  store.state = game.state;
  return game;
}

function pending() { return store.state.prompts.find(prompt => prompt.result === undefined); }

function resolve(raw: unknown, log?: StateLog) {
  const prompt = pending();
  if (!prompt) throw new Error('No pending prompt');
  const result = prompt.decode(raw, store.state);
  if (!prompt.validate(result, store.state)) throw new Error(`Invalid ${prompt.type} result`);
  store.dispatch(new ResolvePromptAction(prompt.id, result, log));
  return prompt;
}

function animations() {
  while (pending() instanceof WaitPrompt) resolve(true);
}

function attack(name: string) {
  store.dispatch(new AttackAction(store.state.players[store.state.activePlayer].id, name));
  animations();
}

function coinLogs() {
  return store.state.logs.filter(log => log.message === GameLog.LOG_PLAYER_FLIPS_HEADS
    || log.message === GameLog.LOG_PLAYER_FLIPS_TAILS).map(log => log.message);
}

for (const card of overridePrints) {
  it(`${card} treats a browser-resolved Crushing Hammer coin as tails and records that outcome`, () => {
    const { player1, player2 } = start({ active: { card: 'Hoppip EVS' }, hand: ['Crushing Hammer SVI'] },
      { active: { card, energy: [water] } });
    store.dispatch(new PlayCardAction(player1.id, 0, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0 }));
    expect(pending() instanceof CoinFlipPrompt).toBe(true);
    const prompt = resolve(true, new StateLog(GameLog.LOG_PLAYER_FLIPS_HEADS, { name: player1.name }));
    expect(prompt.result).toBe(false);
    expect(coinLogs()).toEqual([GameLog.LOG_PLAYER_FLIPS_TAILS]);
    expect(pending()).toBeUndefined();
    expect(player2.active.energies.cards.map(energy => energy.fullName)).toEqual([water]);
  });

  it(`${card} treats Confusion as tails on the opponent's turn`, () => {
    const { player1, player2 } = start({ active: { card: 'Hoppip EVS', energy: [grass] } }, { active: { card } });
    player1.active.specialConditions = [SpecialCondition.CONFUSED];
    attack('Continuous Spin');
    const prompt = pending();
    expect(prompt instanceof CoinFlipPrompt && prompt.message).toBe(GameMessage.FLIP_CONFUSION);
    resolve(true);
    animations();
    expect(player1.active.damage).toBe(30);
    expect(player2.active.damage).toBe(0);
    expect(pending()).toBeUndefined();
  });

  it(`${card} leaves Checkup sleep coins alone`, () => {
    const { player1 } = start({ active: { card: 'Hoppip EVS', energy: [grass] } }, { active: { card } });
    player1.active.specialConditions = [SpecialCondition.ASLEEP];
    store.dispatch(new PassTurnAction(player1.id));
    expect(pending() instanceof CoinFlipPrompt).toBe(true);
    const prompt = resolve(true);
    animations();
    expect(prompt.result).toBe(true);
    expect(player1.active.specialConditions).not.toContain(SpecialCondition.ASLEEP);
  });

  it(`${card} forces its opponent's typed attack coin to tails`, () => {
    const { player1 } = start({ active: { card: 'Chansey BS', energy: [water, water] } }, { active: { card } });
    const random = spyOn(Math, 'random').and.returnValue(0.1);
    attack('Scrunch');
    expect(random).not.toHaveBeenCalled();
    expect(coinLogs()).toEqual([GameLog.LOG_PLAYER_FLIPS_TAILS]);
    expect(player1.active.preventDamageNextTurn).toBe(false);
  });

  it(`${card} treats every coin in the chosen reroll as tails`, () => {
    const { player2 } = start({ active: { card: 'Hoppip EVS', energy: [grass] }, bench: [{ card: 'Victini GRI' }] },
      { active: { card } });
    attack('Continuous Spin');
    const first = resolve(true);
    expect(first.result).toBe(false);
    expect(pending() instanceof ConfirmPrompt).toBe(true);
    resolve(true);
    const second = resolve(true);
    expect(second.result).toBe(false);
    animations();
    expect(pending()).toBeUndefined();
    expect(player2.active.damage).toBe(0);
  });
}

for (const { card, bench, shouldForceTails, title } of [
  { card: 'Malamar XYP', bench: { card: 'Garbodor DRX', tools: ['Float Stone PLF'] }, shouldForceTails: false,
    title: 'friendly Garbotoxin suppresses Contrary' },
  { card: 'Malamar XYP', bench: { card: 'Garbodor DRX', tools: ['Float Stone PLF'] }, shouldForceTails: true,
    title: 'θ Stop blocks opposing Garbotoxin' },
  { card: 'Shiftry RR', bench: { card: 'Dialga G LV.X PL' }, shouldForceTails: false,
    title: 'Time Crystal suppresses Unlucky Wind' },
]) {
  it(title, () => {
    const friendlyGarbodor = card === 'Malamar XYP' && !shouldForceTails;
    const { player2 } = start({ active: { card: 'Hoppip EVS', energy: [grass] }, bench: friendlyGarbodor ? [] : [bench] },
      { active: { card }, bench: friendlyGarbodor ? [bench] : [] });
    attack('Continuous Spin');
    expect(resolve(true).result).toBe(!shouldForceTails);
    if (!shouldForceTails) resolve(false);
    animations();
    expect(player2.active.damage).toBe(shouldForceTails ? 0 : 20);
  });
}

it('a Benched Malamar leaves the active attacker’s coins alone', () => {
  const { player2 } = start({ active: { card: 'Hoppip EVS', energy: [grass] } },
    { active: { card: 'Dragapult ex TWM' }, bench: [{ card: 'Malamar XYP' }] });
  attack('Continuous Spin');
  expect(resolve(true).result).toBe(true);
  resolve(false);
  animations();
  expect(player2.active.damage).toBe(20);
});

for (const heads of [true, false]) {
  it(`Scrunch uses its one displayed coin to apply damage protection on ${heads ? 'heads' : 'tails'}`, () => {
    const { player1 } = start({ active: { card: 'Chansey BS', energy: [water, water] } },
      { active: { card: 'Seadra DF', energy: [fighting, water, water] } });
    const random = spyOn(Math, 'random').and.returnValues(heads ? 0.1 : 0.9, heads ? 0.9 : 0.1);
    attack('Scrunch');
    expect(random).toHaveBeenCalledTimes(1);
    expect(coinLogs()).toEqual([heads ? GameLog.LOG_PLAYER_FLIPS_HEADS : GameLog.LOG_PLAYER_FLIPS_TAILS]);
    attack('Razor Wing');
    expect(player1.active.damage).toBe(heads ? 0 : 80);
  });
}

it('Scrunch uses the final Victory Star outcome once', () => {
  spyOn(Math, 'random').and.returnValues(0.9, 0.1);
  const { player1 } = start({ active: { card: 'Chansey BS', energy: [water, water] }, bench: [{ card: 'Victini GRI' }] },
    { active: { card: 'Seadra DF', energy: [fighting, water, water] } });
  attack('Scrunch');
  expect(pending() instanceof ConfirmPrompt).toBe(true);
  expect(player1.active.preventDamageNextTurnPending).toBe(false);
  resolve(true);
  animations();
  expect(coinLogs()).toEqual([GameLog.LOG_PLAYER_FLIPS_TAILS, GameLog.LOG_PLAYER_FLIPS_HEADS]);
  expect(player1.active.preventDamageNextTurn).toBe(true);
});

for (const legacy of [false, true]) {
  for (const heads of [false, true]) {
    it(`Seadra's ${legacy ? 'saved' : 'new'} Smokescreen uses one coin before copied-attack selection on ${heads ? 'heads' : 'tails'}`, () => {
      const { player1, player2 } = start({ active: { card: 'Seadra DF', energy: [water, water] } },
        { active: { card: 'Mew ex MEW', energy: [water, water, water] } });
      if (legacy) {
        const source = player1.active.getPokemonCard()!;
        player2.active.marker.addMarker(MarkerConstants.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, source);
        store.dispatch(new PassTurnAction(player1.id));
        animations();
      } else {
        attack('Smokescreen');
        expect(player2.active.coinFlipCancelAttackNextTurn).toBe(1);
      }

      const random = spyOn(Math, 'random').and.returnValue(heads ? 0.1 : 0.9);
      attack('Genome Hacking');
      expect(random).toHaveBeenCalledTimes(1);
      expect(coinLogs()).toEqual([heads ? GameLog.LOG_PLAYER_FLIPS_HEADS : GameLog.LOG_PLAYER_FLIPS_TAILS]);
      if (heads) {
        expect(pending() instanceof ChooseAttackPrompt).toBe(true);
        resolve({ index: 0, attack: 'Razor Wing' });
        animations();
      }
      expect(player1.active.damage).toBe(heads ? 40 : 0);
      expect(player2.active.coinFlipCancelAttackNextTurn).toBe(0);
      expect(player2.active.marker.hasMarker(MarkerConstants.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER)).toBe(false);
      expect(pending()).toBeUndefined();
    });
  }
}
