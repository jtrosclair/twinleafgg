import { ensureClientCards } from '../../client/cards';
import { GameLog, GameMessage } from '../../game/game-message';
import { AttackAction } from '../../game/store/actions/game-actions';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { SpecialCondition } from '../../game/store/card/card-types';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ChooseAttackPrompt } from '../../game/store/prompts/choose-attack-prompt';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { Store } from '../../game/store/store';
import { padDeck, PlayerConfig, setupGame } from './test-helpers';

const water = 'Water Energy SVE';
const darkness = 'Darkness Energy SVE';
const dedenne = 'Dedenne VIV';
const gligar = 'Gligar BCR';
const opponent = 'Regigigas ASR';
const tailTrickery = 'Tail Trickery';
const wickedJab = 'Wicked Jab';
let store: Store;

beforeAll(ensureClientCards);
beforeEach(() => spyOn(Math, 'random').and.returnValue(0.1));
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
    expect(heads).toBe(true);
    resolve(true);
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

function selectOwnBench() {
  if (!(pending() instanceof ChoosePokemonPrompt)) throw new Error('Expected a Bench choice');
  resolve([{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 }]);
}

function finish() {
  while (pending() instanceof WaitPrompt) resolve(true);
  expect(pending()).toBeUndefined();
  expect(store.state.turn).toBe(6);
  expect(store.state.logs.filter(log => log.message === GameLog.LOG_PLAYER_USES_ATTACK).length).toBe(1);
}

it('Mini-Metronome applies the copied damage and Tail Trickery Confusion', () => {
  const { player1, player2, state } = start({ active: { card: 'Clefairy VIV', energy: [water, water] } },
    { active: { card: dedenne } });
  attack('Mini-Metronome');
  flip(true);
  selectAttack(tailTrickery);
  finish();
  expect(player2.active.damage).toBe(10);
  expect(player2.active.specialConditions).toContain(SpecialCondition.CONFUSED);
  expect(state.playerLastAttack[player1.id].attack.name).toBe('Mini-Metronome');
});

it('Mini-Metronome can still copy Assist and use an attack from its own Bench', () => {
  const { player2 } = start({ active: { card: 'Clefairy VIV', energy: [water, water] }, bench: [{ card: dedenne }] },
    { active: { card: 'Liepard BLW' } });
  attack('Mini-Metronome');
  flip(true);
  selectAttack('Assist');
  selectOwnBench();
  selectAttack(tailTrickery);
  finish();
  expect(player2.active.damage).toBe(10);
  expect(player2.active.specialConditions).toContain(SpecialCondition.CONFUSED);
});

it('Try to Imitate rolls the copied Wicked Jab after its damage', () => {
  const { player2 } = start({ active: { card: "Ethan's Sudowoodo DRI", energy: [water, water] } },
    { active: { card: gligar } });
  attack('Try to Imitate');
  flip(true);
  selectAttack(wickedJab);
  expect(player2.active.damage).toBe(20);
  flip(true);
  finish();
  expect(player2.active.specialConditions).toContain(SpecialCondition.PARALYZED);
});

it('coin-gated Assist includes the selected Benched attack’s Confusion', () => {
  const { player1, player2, state } = start({
    active: { card: 'Liepard BCR', energy: [darkness, water, water] }, bench: [{ card: dedenne }],
  }, { active: { card: opponent } });
  attack('Assist');
  flip(true);
  selectOwnBench();
  selectAttack(tailTrickery);
  finish();
  expect(player2.active.damage).toBe(10);
  expect(player2.active.specialConditions).toContain(SpecialCondition.CONFUSED);
  expect(state.playerLastAttack[player1.id].attack.name).toBe('Assist');
});

it('Liepard BLW does not add a preliminary coin to its unconditional Assist', () => {
  const { player2 } = start({
    active: { card: 'Liepard BLW', energy: [darkness] }, bench: [{ card: dedenne }],
  }, { active: { card: opponent } });
  attack('Assist');
  selectOwnBench();
  selectAttack(tailTrickery);
  finish();
  expect(player2.active.specialConditions).toContain(SpecialCondition.CONFUSED);
});

it('Trace uses the selected Bench attack without repeating Smokescreen or Confusion', () => {
  const { player1, player2, state } = start({ active: { card: 'Smeargle SW', energy: [water] } },
    { active: { card: opponent }, bench: [{ card: dedenne }] });
  player1.active.specialConditions.push(SpecialCondition.CONFUSED);
  player1.active.coinFlipCancelAttackNextTurn = 1;
  attack('Trace');
  flip(true);
  flip(true, GameMessage.FLIP_CONFUSION);
  flip(true);
  expect((pending() as ChooseAttackPrompt).options.allowCancel).toBe(false);
  selectAttack(tailTrickery);
  finish();
  expect(player1.active.damage).toBe(0);
  expect(player2.active.damage).toBe(10);
  expect(player2.active.specialConditions).toContain(SpecialCondition.CONFUSED);
  expect(state.playerLastAttack[player1.id].attack.name).toBe('Trace');
});

it('Genome Hacking uses copied attack status without borrowing a Psychic attack cost', () => {
  const { player2 } = start({ active: { card: 'Mew ex MEW', energy: [water, water, water] } },
    { active: { card: dedenne } });
  attack('Genome Hacking');
  selectAttack(tailTrickery);
  finish();
  expect(player2.active.damage).toBe(10);
  expect(player2.active.specialConditions).toContain(SpecialCondition.CONFUSED);
});

it('a copied attack can still be defended against with Mist Energy', () => {
  const { player2 } = start({ active: { card: 'Clefairy VIV', energy: [water, water] } },
    { active: { card: dedenne, energy: ['Mist Energy TEF'] } });
  attack('Mini-Metronome');
  flip(true);
  selectAttack(tailTrickery);
  finish();
  expect(player2.active.damage).toBe(10);
  expect(player2.active.specialConditions).not.toContain(SpecialCondition.CONFUSED);
});

it('an uncopied tails ends the attack without opening a card choice', () => {
  const { player2 } = start({ active: { card: 'Clefairy VIV', energy: [water, water] } },
    { active: { card: dedenne } });
  attack('Mini-Metronome');
  flip(false);
  finish();
  expect(player2.active.damage).toBe(0);
});

for (const energy of [[], [water], ['Mist Energy TEF']]) {
  it(`Smithereen Smash resolves correctly against ${energy.join('') || 'an empty attachment zone'}`, () => {
    const { player2 } = start({ active: { card: 'Trapinch BCR', energy: [water] } },
      { active: { card: opponent, energy } });
    attack('Smithereen Smash');
    flip(true);
    if (energy.length) {
      expect(pending() instanceof ChooseCardsPrompt).toBe(true);
      const index = player2.active.cards.findIndex(card => card.fullName === energy[0]);
      resolve([index]);
    }
    finish();
    expect(player2.discard.cards.map(card => card.fullName)).toEqual(energy[0] === water ? [water] : []);
    if (energy[0] === 'Mist Energy TEF') expect(player2.active.cards.some(card => card.fullName === energy[0])).toBe(true);
  });
}
