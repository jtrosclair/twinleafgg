import { ensureClientCards } from '../../client/cards';
import { GameError } from '../../game/game-error';
import { GameLog, GameMessage } from '../../game/game-message';
import { AttackAction, PassTurnAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { SpecialCondition } from '../../game/store/card/card-types';
import { WILL_FIRST_COIN } from '../../game/store/prefabs/will-coin-choice';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { ChoosePrizePrompt } from '../../game/store/prompts/choose-prize-prompt';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { SelectPrompt } from '../../game/store/prompts/select-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { Store } from '../../game/store/store';
import { getCardByName, padDeck, PlayerConfig, setupGame } from './test-helpers';

const active = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const board = { ...active, slot: SlotType.BOARD };
const grass = 'Grass Energy SVE';
const water = 'Water Energy SVE';
const dark = 'Darkness Energy SVE';
const fighting = 'Fighting Energy SVE';
const psychic = 'Psychic Energy SVE';
const will = 'Will CEC';

beforeAll(ensureClientCards);
let store: Store;
afterEach(() => store?.cleanup());

function start(left: PlayerConfig, right: PlayerConfig = { active: { card: 'Dragapult ex TWM' } }) {
  const game = setupGame({ turn: 5, player1: { deck: padDeck(8), ...left, hand: [will, ...(left.hand ?? [])] },
    player2: { deck: padDeck(8), ...right } });
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
  if (!prompt.validate(result, store.state)) throw new Error(`Invalid ${prompt.type} result`);
  store.dispatch(new ResolvePromptAction(prompt.id, result));
  return prompt;
}

function animations() {
  while (pending() instanceof WaitPrompt) resolve(true);
}

function attack(name: string) {
  store.dispatch(new AttackAction(store.state.players[store.state.activePlayer].id, name));
  animations();
}

function playWill() {
  store.dispatch(new PlayCardAction(store.state.players[0].id, 0, board));
  expect(pending()).toBeUndefined();
  expect(store.state.players[0].marker.hasMarker(WILL_FIRST_COIN)).toBe(true);
}

function choose(side: 0 | 1) {
  const prompt = pending();
  if (!(prompt instanceof SelectPrompt)) throw new Error('Expected Will to offer a coin side');
  expect(prompt.message).toBe(GameMessage.CHOOSE_HEADS_OR_TAILS);
  expect(prompt.playerId).toBe(store.state.players[0].id);
  expect(prompt.values).toEqual(['GAME_MESSAGES.HEADS', 'GAME_MESSAGES.TAILS']);
  expect(prompt.options.allowCancel).toBe(false);
  resolve(side);
}

function coinLogs() {
  return store.state.logs.filter(log => log.message === GameLog.LOG_PLAYER_FLIPS_HEADS
    || log.message === GameLog.LOG_PLAYER_FLIPS_TAILS).map(log => log.message);
}

it('offers Will on the first Continuous Spin coin and rejects invalid choices without consuming the prompt', () => {
  const { player2 } = start({ active: { card: 'Hoppip EVS', energy: [grass] } });
  playWill();
  attack('Continuous Spin');
  expect(() => resolve(null)).toThrow(new GameError(GameMessage.INVALID_PROMPT_RESULT));
  expect(() => resolve(2)).toThrow(new GameError(GameMessage.INVALID_PROMPT_RESULT));
  expect(player2.active.damage).toBe(0);
  choose(0);
  expect(pending() instanceof CoinFlipPrompt).toBe(true);
  resolve(false);
  animations();
  expect(player2.active.damage).toBe(20);
  expect(coinLogs()).toEqual([GameLog.LOG_PLAYER_FLIPS_HEADS]);
  expect(pending()).toBeUndefined();
});

it('lets the player choose tails and ends an until-tails attack without another flip', () => {
  const { player2 } = start({ active: { card: 'Hoppip EVS', energy: [grass] } });
  playWill();
  attack('Continuous Spin');
  choose(1);
  animations();
  expect(player2.active.damage).toBe(0);
  expect(coinLogs()).toEqual([GameLog.LOG_PLAYER_FLIPS_TAILS]);
  expect(pending()).toBeUndefined();
});

it('asks for Will before revealing any of the remaining Work Rush coins', () => {
  const { player2 } = start({ active: { card: "Larry's Dudunsparce ex MC", energy: [water, water, water] } });
  playWill();
  attack('Work Rush');
  expect(store.state.prompts.filter(prompt => prompt.result === undefined).length).toBe(1);
  choose(1);
  expect(store.state.prompts.filter(prompt => prompt.result === undefined && prompt instanceof CoinFlipPrompt).length).toBe(2);
  resolve(true);
  resolve(false);
  animations();
  expect(player2.active.damage).toBe(80);
});

it('allows Victory Star to replace every typed coin without using Will again', () => {
  const { player2 } = start({ active: { card: 'Liepard BLW', energy: [dark, dark, water] },
    bench: [{ card: 'Victini GRI' }] });
  playWill();
  const rolls = [0.9, 0.9, 0.1, 0.9, 0.9];
  spyOn(Math, 'random').and.callFake(() => rolls.shift() ?? 0.9);
  attack('Fury Swipes');
  choose(0);
  animations();
  expect(pending() instanceof ConfirmPrompt).toBe(true);
  expect(coinLogs()).toEqual([GameLog.LOG_PLAYER_FLIPS_HEADS, GameLog.LOG_PLAYER_FLIPS_TAILS, GameLog.LOG_PLAYER_FLIPS_TAILS]);
  resolve(true);
  animations();
  expect(coinLogs()).toEqual([
    GameLog.LOG_PLAYER_FLIPS_HEADS, GameLog.LOG_PLAYER_FLIPS_TAILS, GameLog.LOG_PLAYER_FLIPS_TAILS,
    GameLog.LOG_PLAYER_FLIPS_HEADS, GameLog.LOG_PLAYER_FLIPS_TAILS, GameLog.LOG_PLAYER_FLIPS_TAILS,
  ]);
  expect(player2.active.damage).toBe(40);
  expect(pending()).toBeUndefined();
});

it('lets Will choose heads for Crushing Hammer while Contrary makes the result tails', () => {
  const { player1, player2 } = start({ active: { card: 'Hoppip EVS' }, hand: ['Crushing Hammer SVI'] },
    { active: { card: 'Malamar XYP', energy: [water] } });
  playWill();
  store.dispatch(new PlayCardAction(player1.id, 0, board));
  choose(0);
  expect(coinLogs()).toEqual([GameLog.LOG_PLAYER_FLIPS_TAILS]);
  expect(pending()).toBeUndefined();
  expect(player2.active.energies.cards.map(energy => energy.fullName)).toEqual([water]);
});

it('saves Will through Confusion and uses it on the attack only when the Confusion coin succeeds', () => {
  const { player1 } = start({ active: { card: 'Hoppip EVS', energy: [grass] } });
  player1.active.specialConditions = [SpecialCondition.CONFUSED];
  playWill();
  attack('Continuous Spin');
  const prompt = pending();
  expect(prompt instanceof CoinFlipPrompt && prompt.message).toBe(GameMessage.FLIP_CONFUSION);
  resolve(true);
  choose(1);
  animations();
  expect(player1.active.damage).toBe(0);
});

it('uses Will on an attack-effect Smokescreen coin before resolving the newly announced attack', () => {
  const { player1, player2 } = start({ active: { card: 'Hoppip EVS', energy: [grass] } });
  player1.active.coinFlipCancelAttackNextTurn = 1;
  playWill();
  attack('Continuous Spin');
  choose(0);
  animations();
  expect(pending() instanceof CoinFlipPrompt).toBe(true);
  resolve(true);
  resolve(false);
  animations();
  expect(player2.active.damage).toBe(20);
});

it('keeps Will available through an older Pokémon Power’s coin', () => {
  const { player1 } = start({ active: { card: 'Hoppip EVS', energy: [grass] },
    bench: [{ card: 'Noctowl N1' }], hand: ['Crushing Hammer SVI'] },
    { active: { card: 'Dragapult ex TWM', energy: [water] } });
  playWill();
  const random = spyOn(Math, 'random').and.returnValue(0.9);
  store.dispatch(new UseAbilityAction(player1.id, 'Glaring Gaze', { ...active, slot: SlotType.BENCH }));
  animations();
  expect(random).toHaveBeenCalledTimes(1);
  expect(player1.marker.hasMarker(WILL_FIRST_COIN)).toBe(true);
  store.dispatch(new PlayCardAction(player1.id, 0, board));
  choose(0);
  expect(pending() instanceof ChoosePokemonPrompt).toBe(true);
});

it('keeps Will for a later Item when attaching to Forretress triggers Iron Shell', () => {
  const { player1, player2 } = start({ active: { card: 'Forretress LA' }, hand: [grass, 'Crushing Hammer SVI'] },
    { active: { card: 'Dragapult ex TWM', energy: [water] } });
  playWill();
  spyOn(Math, 'random').and.returnValue(0.9);
  store.dispatch(new PlayCardAction(player1.id, 0, active));
  expect(pending() instanceof WaitPrompt).toBe(true);
  animations();
  expect(player2.active.damage).toBe(20);
  expect(player1.marker.hasMarker(WILL_FIRST_COIN)).toBe(true);
  store.dispatch(new PlayCardAction(player1.id, 0, board));
  choose(0);
  expect(pending() instanceof ChoosePokemonPrompt).toBe(true);
});

it('does not use Will on the opponent’s Bench Manipulation coins', () => {
  const { player1, player2 } = start({ active: { card: "Team Rocket's Hypno DRI", energy: [psychic, psychic, psychic] } },
    { active: { card: 'Dragapult ex TWM' }, bench: [{ card: 'Hoppip EVS' }] });
  playWill();
  spyOn(Math, 'random').and.returnValue(0.9);
  attack('Bench Manipulation');
  expect(coinLogs()).toEqual([GameLog.LOG_PLAYER_FLIPS_TAILS]);
  expect(player2.active.damage).toBe(80);
  expect(player1.marker.hasMarker(WILL_FIRST_COIN)).toBe(false);
  expect(pending()).toBeUndefined();
});

it('clears a pending Will when the player passes the turn', () => {
  const { player1, player2 } = start({ active: { card: 'Hoppip EVS', energy: [grass] } });
  playWill();
  store.dispatch(new PassTurnAction(player1.id));
  expect(player1.marker.hasMarker(WILL_FIRST_COIN)).toBe(false);
  store.dispatch(new PassTurnAction(player2.id));
  attack('Continuous Spin');
  expect(pending() instanceof CoinFlipPrompt).toBe(true);
});

for (const print of ['Greedy Dice STS', 'Chansey MEW']) {
  for (const side of [0, 1] as const) {
    it(`uses Will for ${print}'s one Prize coin on ${side === 0 ? 'heads' : 'tails'}`, () => {
      const { player1 } = start({ active: { card: 'Seadra DF', energy: [fighting, water, water] },
        bench: [{ card: 'Victini GRI' }], prizeCount: 3 },
        { active: { card: 'Hoppip EVS' }, bench: [{ card: 'Dragapult ex TWM' }] });
      const specialPrize = getCardByName(print);
      specialPrize.id = 999;
      player1.prizes[0].cards = [specialPrize];
      playWill();
      attack('Razor Wing');
      const beforePrizes = pending();
      if (beforePrizes instanceof ChoosePokemonPrompt && beforePrizes.message === GameMessage.CHOOSE_NEW_ACTIVE_POKEMON) {
        resolve([{ ...active, slot: SlotType.BENCH }]);
        animations();
      }
      const confirmation = pending();
      expect(confirmation instanceof ConfirmPrompt && confirmation.message).toBe(print === 'Greedy Dice STS'
        ? GameMessage.WANT_TO_USE_ITEM_FROM_PRIZES : GameMessage.WANT_TO_USE_ABILITY_FROM_PRIZES);
      resolve(true);
      choose(side);
      animations();
      expect(coinLogs()).toEqual([side === 0 ? GameLog.LOG_PLAYER_FLIPS_HEADS : GameLog.LOG_PLAYER_FLIPS_TAILS]);
      if (side === 0) {
        const bonus = pending();
        expect(bonus instanceof ChoosePrizePrompt && bonus.options.blocked).toEqual([]);
        resolve([0]);
        animations();
      }
      expect(player1.prizesTaken).toBe(side === 0 ? 2 : 1);
      if (print === 'Greedy Dice STS') expect(player1.discard.cards).toContain(specialPrize);
      else expect(player1.bench.some(slot => slot.getPokemonCard() === specialPrize)).toBe(true);
      expect(pending() instanceof ConfirmPrompt).toBe(false);
    });
  }
}
