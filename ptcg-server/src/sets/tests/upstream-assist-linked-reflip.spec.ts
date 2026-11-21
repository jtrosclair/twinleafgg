import { ensureClientCards } from '../../client/cards';
import { GameLog, GameMessage } from '../../game/game-message';
import { AttackAction } from '../../game/store/actions/game-actions';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { SpecialCondition } from '../../game/store/card/card-types';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { SelectPrompt } from '../../game/store/prompts/select-prompt';
import { ChooseAttackPrompt } from '../../game/store/prompts/choose-attack-prompt';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { Store } from '../../game/store/store';
import { getCardByName, padDeck, PlayerConfig, setupGame } from './test-helpers';

const water = 'Water Energy SVE';
const darkness = 'Darkness Energy SVE';
const victini = 'Victini GRI';
const thunderFang = 'Thunder Fang';
const raikou = 'Raikou EX DEX';
const opponent = 'Regigigas ASR';
let store: Store;

beforeAll(ensureClientCards);
let random: jasmine.Spy;
beforeEach(() => { random = spyOn(Math, 'random').and.returnValue(0.1); });
afterEach(() => store?.cleanup());

function start(player1: PlayerConfig, player2: PlayerConfig) {
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

function pending() {
  return store.state.prompts.find(prompt => prompt.result === undefined);
}

function resolve(raw: unknown) {
  const prompt = pending();
  if (!prompt) throw new Error('Expected a pending prompt');
  const result = prompt.decode(raw, store.state);
  if (!prompt.validate(result, store.state)) throw new Error(`Invalid result for ${prompt.type}`);
  store.dispatch(new ResolvePromptAction(prompt.id, result));
}

function attack(name: string) {
  store.dispatch(new AttackAction(store.state.players[0].id, name));
}

function flip(heads: boolean, message: GameMessage = GameMessage.COIN_FLIP) {
  const prompt = pending();
  if (prompt instanceof WaitPrompt && prompt.message === 'Coin flip animation' && message === GameMessage.COIN_FLIP) {
    resolve(true);
    expect(store.state.logs.some(log => log.message === (heads ? GameLog.LOG_PLAYER_FLIPS_HEADS : GameLog.LOG_PLAYER_FLIPS_TAILS))).toBe(true);
    return;
  }
  if (!(prompt instanceof CoinFlipPrompt)) throw new Error(`Expected a coin, got ${prompt?.type}`);
  expect(prompt.message).toBe(message);
  resolve(heads);
}

function selectAttack(name: string) {
  if (!(pending() instanceof ChooseAttackPrompt)) throw new Error('Expected a copied attack choice');
  resolve({ index: 0, attack: name });
}

function selectOwnBench(index = 0) {
  if (!(pending() instanceof ChoosePokemonPrompt)) throw new Error('Expected a Bench choice');
  resolve([{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index }]);
}

function finish() {
  while (pending() instanceof WaitPrompt) resolve(true);
  expect(pending()).toBeUndefined();
  expect(store.state.turn).toBe(6);
  expect(store.state.logs.filter(log => log.message === GameLog.LOG_PLAYER_USES_ATTACK).length).toBe(1);
}

it('Victory Star rerolls Assist and permits a different attack after the copied coin', () => {
  const { player2 } = start({
    active: { card: 'Liepard BCR', energy: [darkness, water, water] },
    bench: [{ card: 'Trapinch BCR' }, { card: 'Victini GRI' }],
  }, { active: { card: opponent, energy: [water] } });
  attack('Assist');
  flip(true);
  if (pending() instanceof ConfirmPrompt) resolve(false);
  selectOwnBench();
  random.and.returnValue(0.9);
  selectAttack('Smithereen Smash');
  expect((pending() as WaitPrompt).message).toBe('Coin flip animation');
  resolve(true);
  expect(pending() instanceof ConfirmPrompt).toBe(true);
  expect(player2.active.damage).toBe(0);
  expect(player2.discard.cards.length).toBe(0);
  random.and.returnValue(0.1);
  resolve(true);
  flip(true);
  selectOwnBench();
  selectAttack('Hyper Beam');
  finish();
  expect(player2.active.damage).toBe(20);
  expect(player2.active.cards.some(card => card.fullName === water)).toBe(true);
});

function confirmReflip(accept: boolean) {
  const prompt = pending();
  if (!(prompt instanceof ConfirmPrompt)) throw new Error(`Expected a reflip decision, got ${prompt?.type}`);
  expect(prompt.message).toBe(GameMessage.WANT_TO_REFLIP_ATTACK_COINS);
  resolve(accept);
}

for (const keep of [false, true]) {
  it(`handles Thunder Fang's lethal damage ${keep ? 'once on keep' : 'without applying it on restart'}`, () => {
    const { player1, player2 } = start({
      active: { card: 'Liepard BCR', energy: [darkness, water, water] },
      bench: [{ card: raikou }, { card: victini }],
    }, { active: { card: opponent, damage: 130 }, bench: [{ card: 'Lillipup BCR' }] });
    attack('Assist');
    flip(true);
    confirmReflip(false);
    selectOwnBench();
    if (!keep) random.and.returnValue(0.9);
    selectAttack(thunderFang);
    expect(player2.active.damage).toBe(130);
    flip(keep);
    expect(player2.active.damage).toBe(130);
    expect(player1.getPrizeLeft()).toBe(6);
    expect(player2.active.specialConditions).not.toContain(SpecialCondition.PARALYZED);
    confirmReflip(!keep);
    if (keep) {
      expect(player2.active.damage).toBe(160);
      expect(player2.active.specialConditions).toContain(SpecialCondition.PARALYZED);
      expect(store.state.logs.filter(log => log.message === GameLog.LOG_PLAYER_COPIES_ATTACK).length).toBe(1);
    } else {
      flip(false);
      finish();
      expect(player2.active.damage).toBe(130);
      expect(player2.active.specialConditions).not.toContain(SpecialCondition.PARALYZED);
      expect(player1.getPrizeLeft()).toBe(6);
      expect(player2.discard.cards.length).toBe(0);
      expect(store.state.logs.filter(log => log.message === GameLog.LOG_PLAYER_COPIES_ATTACK).length).toBe(0);
    }
  });
}

it('can replace Assist’s initial tails without reaching the Bench choice first', () => {
  const { player2 } = start({
    active: { card: 'Liepard BCR', energy: [darkness, water, water] },
    bench: [{ card: 'Trapinch BCR' }, { card: victini }],
  }, { active: { card: opponent } });
  random.and.returnValue(0.9);
  attack('Assist');
  flip(false);
  random.and.returnValue(0.1);
  confirmReflip(true);
  flip(true);
  selectOwnBench();
  selectAttack('Hyper Beam');
  finish();
  expect(player2.active.damage).toBe(20);
});

it('restarts the outer Mini-Metronome even after its nested Assist flips', () => {
  const { player2 } = start({
    active: { card: 'Clefairy VIV', energy: [water, water] },
    bench: [{ card: 'Trapinch BCR' }, { card: victini }],
  }, { active: { card: 'Liepard BCR' } });
  attack('Mini-Metronome');
  flip(true);
  confirmReflip(false);
  selectAttack('Assist');
  flip(true);
  confirmReflip(true);
  expect(pending() instanceof CoinFlipPrompt).toBe(true);
  flip(false);
  finish();
  expect(player2.active.damage).toBe(0);
});

it('Trace restarts at its gate after a copied until-tails sequence', () => {
  const { player2 } = start({
    active: { card: 'Smeargle SW', energy: [water] }, bench: [{ card: victini }],
  }, { active: { card: opponent }, bench: [{ card: 'Hoppip EVS' }] });
  attack('Trace');
  flip(true);
  confirmReflip(false);
  selectAttack('Continuous Spin');
  flip(true);
  flip(true);
  flip(false);
  expect(player2.active.damage).toBe(0);
  random.and.returnValue(0.9);
  confirmReflip(true);
  flip(false);
  finish();
  expect(player2.active.damage).toBe(0);
});

it('ends with no private search prompt when Assist is rerolled before its first copy', () => {
  const { player1 } = start({
    active: { card: 'Liepard BCR', energy: [darkness, water, water] },
    bench: [{ card: 'Smeargle SW' }, { card: victini }],
  }, { active: { card: opponent } });
  attack('Assist');
  flip(true);
  expect(player1.hand.cards.length).toBe(0);
  expect(store.state.prompts.some(prompt => prompt instanceof ChooseCardsPrompt)).toBe(false);
  random.and.returnValue(0.9);
  confirmReflip(true);
  flip(false);
  finish();
  expect(player1.hand.cards.length).toBe(0);
});

it('keeps a copied private search on the accepted branch and opens it once', () => {
  const { player1 } = start({
    active: { card: 'Liepard BCR', energy: [darkness, water, water] },
    bench: [{ card: 'Smeargle SW' }, { card: victini }], deck: [water, ...padDeck(10)],
  }, { active: { card: opponent } });
  attack('Assist');
  flip(true);
  confirmReflip(false);
  selectOwnBench();
  selectAttack('Color Pick');
  expect(pending() instanceof ChooseCardsPrompt).toBe(true);
  resolve([]);
  while (pending() && !(pending() instanceof WaitPrompt)) {
    const prompt = pending()!;
    expect(prompt.type).toBe('Shuffle deck');
    resolve(player1.deck.cards.map((_card, index) => index));
  }
  finish();
  expect(store.state.prompts.filter(prompt => prompt instanceof ChooseCardsPrompt).length).toBe(1);
});

it('restoring a stable board discards the pending copy and its temporary damage', () => {
  const { player2 } = start({
    active: { card: 'Liepard BCR', energy: [darkness, water, water] },
    bench: [{ card: raikou }, { card: victini }],
  }, { active: { card: opponent } });
  const replacement = setupGame({ turn: 5,
    player1: { active: { card: 'Liepard BCR', energy: [darkness, water, water] }, bench: [{ card: raikou }, { card: victini }] },
    player2: { active: { card: opponent } },
  });
  replacement.store.cleanup();
  attack('Assist');
  flip(true);
  confirmReflip(false);
  selectOwnBench();
  selectAttack(thunderFang);
  const oldPrompt = pending()!;
  expect(player2.active.damage).toBe(0);
  store.restoreState(replacement.state);
  store.dispatch(new ResolvePromptAction(oldPrompt.id, true));
  expect(pending()).toBeUndefined();
  expect(store.state.players[1].active.damage).toBe(0);
  expect(store.state.turn).toBe(5);
});

it('offers one replacement source for the linked coins even with a Tool, Stadium and Victini', () => {
  const { player1, player2 } = start({
    active: { card: 'Liepard BCR', energy: [darkness, water, water], tools: ['Trick Coin PHF'] },
    bench: [{ card: raikou }, { card: victini }],
  }, { active: { card: opponent } });
  player1.stadium.cards.push(getCardByName('Glimwood Tangle DAA'));
  attack('Assist');
  flip(true);
  expect(pending() instanceof SelectPrompt).toBe(true);
  resolve(null);
  selectOwnBench();
  selectAttack(thunderFang);
  flip(true);
  const sources = pending();
  if (!(sources instanceof SelectPrompt)) throw new Error('Expected the three reroll sources');
  expect(sources.values).toEqual(jasmine.arrayWithExactContents(['Trick Coin', 'Victory Star', 'Glimwood Tangle']));
  resolve(sources.values.indexOf('Glimwood Tangle'));
  flip(true);
  selectOwnBench();
  selectAttack(thunderFang);
  flip(true);
  finish();
  expect(player2.active.damage).toBe(30);
  expect(player2.active.specialConditions).toContain(SpecialCondition.PARALYZED);
  expect(store.state.logs.filter(log => log.message === GameLog.LOG_PLAYER_REFLIPS_WITH_GLIMWOOD_TANGLE).length).toBe(1);
});

it('keeps Will spent when the replacement starts at the original gate', () => {
  const { player1, player2 } = start({
    active: { card: 'Liepard BCR', energy: [darkness, water, water] },
    bench: [{ card: raikou }, { card: victini }],
  }, { active: { card: opponent } });
  player1.marker.addMarkerToState('WILL_FIRST_COIN');
  attack('Assist');
  expect((pending() as SelectPrompt).message).toBe(GameMessage.CHOOSE_HEADS_OR_TAILS);
  resolve(0);
  flip(true);
  confirmReflip(false);
  selectOwnBench();
  selectAttack(thunderFang);
  flip(true);
  random.and.returnValue(0.9);
  confirmReflip(true);
  flip(false);
  finish();
  expect(player2.active.damage).toBe(0);
  expect(store.state.prompts.filter(prompt => prompt instanceof SelectPrompt
    && prompt.message === GameMessage.CHOOSE_HEADS_OR_TAILS).length).toBe(1);
});
