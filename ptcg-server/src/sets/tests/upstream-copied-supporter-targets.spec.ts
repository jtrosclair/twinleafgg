import { ensureClientCards } from '../../client/cards';
import { AttackAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { Store } from '../../game/store/store';
import { padDeck, PlayerConfig, setupGame } from './test-helpers';

const lysandre = 'Lysandre FLF';
const tierno = 'Tierno PHF';
const groudon = 'Primal Groudon-EX PRC';
const mist = 'Mist Energy TEF';
const energy = 'Darkness Energy SVE';
const ordinaryPokemon = 'Regigigas ASR';
const board = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0 };
const opposingBench = { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 };
let store: Store;

beforeAll(ensureClientCards);
afterEach(() => store?.cleanup());

function start(player1: PlayerConfig, player2: Partial<PlayerConfig>) {
  const game = setupGame({
    turn: 5,
    player1: { deck: padDeck(10), ...player1 },
    player2: { active: { card: ordinaryPokemon }, deck: padDeck(10), ...player2 },
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

function chooseBench() {
  expect(pending() instanceof ChoosePokemonPrompt).toBe(true);
  resolve([opposingBench]);
}

function chooseSupporter() {
  expect(pending() instanceof ChooseCardsPrompt).toBe(true);
  resolve([0]);
}

function finishAttack() {
  while (pending() instanceof WaitPrompt) resolve(true);
  expect(pending()).toBeUndefined();
  expect(store.state.turn).toBe(6);
}

describe('Lysandre and copied Supporter protection', () => {
  for (const protectedByTrainerRule of [true, false]) {
    it(`resolves a real Lysandre against ${protectedByTrainerRule ? 'the only Ω Barrier target' : 'a target with Mist Energy'}`, () => {
      const { player1, player2 } = start({ active: { card: ordinaryPokemon }, hand: [lysandre] }, {
        bench: [protectedByTrainerRule ? { card: groudon } : { card: 'Hoppip EVS', energy: [mist] }],
      });
      const original = player2.active;
      const choice = player2.bench[0];
      const supporter = player1.hand.cards[0];
      store.dispatch(new PlayCardAction(player1.id, 0, board));
      chooseBench();
      expect(player2.active).toBe(protectedByTrainerRule ? original : choice);
      expect(player1.discard.cards).toContain(supporter);
      expect(player1.supportersPlayedThisTurn).toBe(1);
      expect(pending()).toBeUndefined();
    });
  }

  for (const mistOnTarget of [false, true]) {
    it(`Bewitching Eyes copies Lysandre against ${mistOnTarget ? 'Mist Energy on the chosen Bench target' : 'Ω Barrier with Mist Energy on the old Active'}`, () => {
      const { player1, player2 } = start({
        active: { card: 'Sableye AOR', energy: [energy] }, hand: [tierno],
      }, {
        active: { card: ordinaryPokemon, energy: mistOnTarget ? [] : [mist] },
        bench: [{ card: groudon, energy: mistOnTarget ? [mist] : [] }],
        discard: [lysandre],
      });
      const original = player2.active;
      const choice = player2.bench[0];
      const supporter = player2.discard.cards[0];
      store.dispatch(new PlayCardAction(player1.id, 0, board));
      store.dispatch(new AttackAction(player1.id, 'Bewitching Eyes'));
      chooseSupporter();
      chooseBench();
      expect(player2.active).toBe(mistOnTarget ? original : choice);
      expect(player1.supportersPlayedThisTurn).toBe(1);
      expect(player2.discard.cards).toEqual([supporter]);
      expect(player1.discard.cards.map(card => card.fullName)).toEqual([tierno]);
      finishAttack();
    });
  }

  it('Portrait can copy Lysandre through Ω Barrier and Mist Energy', () => {
    const { player1, player2 } = start({ active: { card: 'Smeargle UD' } }, {
      bench: [{ card: groudon, energy: [mist] }], hand: [lysandre],
    });
    const supporter = player2.hand.cards[0];
    const choice = player2.bench[0];
    store.dispatch(new UseAbilityAction(player1.id, 'Portrait', { ...board, slot: SlotType.ACTIVE }));
    chooseSupporter();
    chooseBench();
    expect(player2.active).toBe(choice);
    expect(player2.hand.cards).toEqual([supporter]);
    expect(player1.supportersPlayedThisTurn ?? 0).toBe(0);
    expect(pending()).toBeUndefined();
  });

  for (const hasBench of [false, true]) {
    it(`Silent Claw discards Lysandre ${hasBench ? 'and respects Mist Energy' : 'even when the opponent has no Bench'}`, () => {
      const { player1, player2 } = start({
        active: { card: 'Liepard PLS', energy: [energy] }, hand: [tierno],
      }, {
        hand: [lysandre, energy],
        bench: hasBench ? [{ card: groudon, energy: [mist] }] : [],
      });
      const supporter = player2.hand.cards[0];
      const original = player2.active;
      store.dispatch(new PlayCardAction(player1.id, 0, board));
      store.dispatch(new AttackAction(player1.id, 'Silent Claw'));
      const reveal = pending();
      expect(reveal instanceof ShowCardsPrompt).toBe(true);
      expect((reveal as ShowCardsPrompt).cards).toEqual(player2.hand.cards);
      resolve(true);
      chooseSupporter();
      if (hasBench) chooseBench();
      expect(player2.discard.cards).toEqual([supporter]);
      expect(player2.hand.cards.map(card => card.fullName)).toEqual([energy]);
      expect(player2.active).toBe(original);
      finishAttack();
    });
  }

  it('Silent Claw sends a discarded Prism Star Supporter to the owner’s Lost Zone', () => {
    const { player1, player2 } = start({ active: { card: 'Liepard PLS', energy: [energy] } }, {
      hand: ['Cyrus ◇ UPR'],
      bench: Array.from({ length: 4 }, () => ({ card: 'Hoppip EVS' })),
    });
    const supporter = player2.hand.cards[0];
    store.dispatch(new AttackAction(player1.id, 'Silent Claw'));
    expect(pending() instanceof ShowCardsPrompt).toBe(true);
    resolve(true);
    chooseSupporter();
    expect(player2.lostzone.cards).toEqual([supporter]);
    expect(player2.discard.cards).toEqual([]);
    finishAttack();
  });
});
