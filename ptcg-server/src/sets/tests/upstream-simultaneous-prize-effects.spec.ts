import { ensureClientCards } from '../../client/cards';
import { GameError } from '../../game/game-error';
import { GameLog, GameMessage } from '../../game/game-message';
import { AttackAction } from '../../game/store/actions/game-actions';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { ChoosePrizePrompt } from '../../game/store/prompts/choose-prize-prompt';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { SelectPrompt } from '../../game/store/prompts/select-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { GameWinner } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { getCardByName, padDeck, PlayerConfig, setupGame } from './test-helpers';

const water = 'Water Energy SVE';
const grass = 'Grass Energy SVE';
const fire = 'Fire Energy SVE';
const dice = 'Greedy Dice STS';
const chansey = 'Chansey MEW';
const dream = 'Dream Ball EVS';
const treasure = 'Treasure Energy EVS';
const jirachi = 'Jirachi ◇ CES';
const evolved = 'Charizard ex OBF';
const ownActive = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };

beforeAll(ensureClientCards);
let store: Store;
afterEach(() => store?.cleanup());

function start(prizes: string[], left: Partial<PlayerConfig> = {}, right: Partial<PlayerConfig> = {}) {
  const game = setupGame({ turn: 5,
    player1: { active: { card: 'Seadra DF', energy: ['Fighting Energy SVE', water, water] },
      deck: [evolved, ...padDeck(7)], prizeCount: prizes.length, ...left },
    player2: { active: { card: 'Dragapult ex TWM', damage: 280 }, deck: padDeck(8),
      bench: [{ card: 'Hoppip EVS' }], ...right },
  });
  for (const [index, print] of prizes.entries()) {
    const card = getCardByName(print);
    card.id = 500 + index;
    game.player1.prizes[index].cards = [card];
  }
  game.store.cleanup();
  store = new Store({ onStateChange: () => undefined });
  store.state = game.state;
  return game;
}

function pending() { return store.state.prompts.find(prompt => prompt.result === undefined); }

function resolve(raw: unknown) {
  const prompt = pending();
  if (!prompt) throw new Error('Expected a pending prompt');
  const decoded = prompt.decode(raw, store.state);
  if (!prompt.validate(decoded, store.state)) throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
  store.dispatch(new ResolvePromptAction(prompt.id, decoded));
}

function animations() {
  while (pending() instanceof WaitPrompt) resolve(true);
}

function knockOut() {
  store.dispatch(new AttackAction(store.state.players[0].id, 'Razor Wing'));
  animations();
}

function confirm(message: GameMessage, accepted = true) {
  const prompt = pending();
  expect(prompt instanceof ConfirmPrompt && prompt.message).toBe(message);
  resolve(accepted);
}

function order(names: string[], index: number) {
  const prompt = pending();
  if (!(prompt instanceof SelectPrompt)) throw new Error(`Expected a Prize effect order choice, got ${prompt?.type}`);
  expect(String(prompt.message)).toBe('CHOOSE_PRIZE_EFFECT_ORDER');
  expect(prompt.values).toEqual(names);
  expect(prompt.options.allowCancel).toBe(false);
  resolve(index);
}

function bonus(blocked: number[], index: number) {
  const prompt = pending();
  if (!(prompt instanceof ChoosePrizePrompt)) throw new Error('Expected an extra Prize choice');
  expect(prompt.options.blocked).toEqual(blocked);
  resolve([index]);
  animations();
}

function promote() {
  const prompt = pending();
  if (prompt instanceof ChoosePokemonPrompt && prompt.message === GameMessage.CHOOSE_NEW_ACTIVE_POKEMON) {
    resolve([{ ...ownActive, slot: SlotType.BENCH }]);
    animations();
  }
}

function names(cards: { fullName: string }[]) { return cards.map(card => card.fullName); }

it('keeps the ordinary Prize from a two-Prize Knock Out alongside Lucky Bonus', () => {
  const { player1, player2 } = start([chansey, grass, water]);
  spyOn(Math, 'random').and.returnValue(0.9);
  knockOut();
  confirm(GameMessage.WANT_TO_USE_ABILITY_FROM_PRIZES);
  animations();
  promote();
  expect(names(player1.hand.cards)).toEqual([grass]);
  expect(player1.bench[0].getPokemonCard()?.fullName).toBe(chansey);
  expect(player1.prizesTaken).toBe(2);
  expect(player2.active.getPokemonCard()?.fullName).toBe('Hoppip EVS');
  expect(pending()).toBeUndefined();
});

it('lets both Greedy Dice finish in turn and protects the sibling from being taken as a bonus', () => {
  const { player1 } = start([dice, dice, grass, fire, water]);
  spyOn(Math, 'random').and.returnValue(0.1);
  knockOut();
  order(['Greedy Dice', 'Greedy Dice'], 0);
  expect(pending() instanceof ConfirmPrompt).toBe(true);
  expect(store.state.prompts.filter(prompt => prompt.result === undefined).length).toBe(1);
  confirm(GameMessage.WANT_TO_USE_ITEM_FROM_PRIZES);
  animations();
  expect(() => resolve([0])).toThrow(new GameError(GameMessage.INVALID_PROMPT_RESULT));
  bonus([0], 1);
  confirm(GameMessage.WANT_TO_USE_ITEM_FROM_PRIZES);
  animations();
  bonus([], 0);
  promote();
  expect(names(player1.discard.cards)).toEqual([dice, dice]);
  expect(names(player1.hand.cards)).toEqual([grass, fire]);
  expect(player1.prizesTaken).toBe(4);
  expect(pending()).toBeUndefined();
});

it('lets two copies of Lucky Bonus each resolve on the same Knock Out', () => {
  const { player1 } = start([chansey, chansey, grass]);
  spyOn(Math, 'random').and.returnValue(0.9);
  knockOut();
  order(['Chansey', 'Chansey'], 1);
  confirm(GameMessage.WANT_TO_USE_ABILITY_FROM_PRIZES);
  animations();
  confirm(GameMessage.WANT_TO_USE_ABILITY_FROM_PRIZES);
  animations();
  promote();
  expect(player1.bench.map(slot => slot.getPokemonCard()?.id).slice(0, 2)).toEqual([501, 500]);
  expect(player1.prizesTaken).toBe(2);
  expect(store.state.logs.filter(log => log.message === GameLog.LOG_PLAYER_FLIPS_TAILS).length).toBe(2);
  expect(pending()).toBeUndefined();
});

for (const dreamFirst of [false, true]) {
  it(`uses the selected effect first when ${dreamFirst ? 'Dream Ball' : 'Lucky Bonus'} fills the last Bench slot`, () => {
    const { player1 } = start([chansey, dream, grass], { bench: Array.from({ length: 4 }, () => ({ card: 'Hoppip EVS' })) });
    spyOn(Math, 'random').and.returnValue(0.9);
    knockOut();
    order(['Chansey', 'Dream Ball'], dreamFirst ? 1 : 0);
    if (dreamFirst) {
      confirm(GameMessage.WANT_TO_USE_ITEM_FROM_PRIZES);
      expect(pending() instanceof ChooseCardsPrompt).toBe(true);
      resolve([0]);
      const shuffle = pending();
      if (!(shuffle instanceof ShuffleDeckPrompt)) throw new Error('Expected the Dream Ball shuffle');
      resolve(player1.deck.cards.map((_, index) => index));
    } else {
      confirm(GameMessage.WANT_TO_USE_ABILITY_FROM_PRIZES);
      animations();
    }
    promote();
    expect(player1.bench[4].getPokemonCard()?.fullName).toBe(dreamFirst ? evolved : chansey);
    expect(names(player1.hand.cards)).toEqual([dreamFirst ? chansey : dream]);
    expect(names(player1.discard.cards)).toEqual(dreamFirst ? [dream] : []);
    expect(player1.prizesTaken).toBe(2);
    expect(pending()).toBeUndefined();
  });
}

it('offers both Dream Balls, puts the declined copy in hand and permits a private search to fail', () => {
  const { player1 } = start([dream, dream, water], { deck: padDeck(8) });
  knockOut();
  order(['Dream Ball', 'Dream Ball'], 0);
  confirm(GameMessage.WANT_TO_USE_ITEM_FROM_PRIZES, false);
  confirm(GameMessage.WANT_TO_USE_ITEM_FROM_PRIZES);
  expect(pending() instanceof ChooseCardsPrompt).toBe(true);
  resolve([]);
  expect(pending() instanceof ShuffleDeckPrompt).toBe(true);
  resolve(player1.deck.cards.map((_, index) => index));
  promote();
  expect(names(player1.hand.cards)).toEqual([dream]);
  expect(names(player1.discard.cards)).toEqual([dream]);
  expect(player1.prizesTaken).toBe(2);
  expect(pending()).toBeUndefined();
});

it('resolves a nested Jirachi, Greedy Dice and Treasure Energy chain before the normal sibling', () => {
  const { player1 } = start([jirachi, grass, dice, treasure, fire]);
  spyOn(Math, 'random').and.returnValue(0.1);
  knockOut();
  confirm(GameMessage.WANT_TO_USE_ABILITY_FROM_PRIZES);
  bonus([0], 1);
  confirm(GameMessage.WANT_TO_USE_ITEM_FROM_PRIZES);
  animations();
  bonus([0], 1);
  confirm(GameMessage.WANT_TO_USE_ITEM_FROM_PRIZES);
  const place = pending();
  expect(place instanceof ChoosePokemonPrompt && place.message).toBe(GameMessage.ATTACH_ENERGY_CARDS);
  resolve([ownActive]);
  animations();
  promote();
  expect(names(player1.active.energies.cards)).toContain(treasure);
  expect(player1.bench[0].getPokemonCard()?.fullName).toBe(jirachi);
  expect(names(player1.hand.cards)).toEqual([grass]);
  expect(names(player1.discard.cards)).toEqual([dice]);
  expect(player1.prizesTaken).toBe(4);
  expect(pending()).toBeUndefined();
});

it('attaches Treasure Energy straight from the Prize without hand-attachment penalties or counter changes', () => {
  const { player1 } = start([treasure, grass, fire], {}, { bench: [{ card: 'Arctozolt DAA' }] });
  knockOut();
  confirm(GameMessage.WANT_TO_USE_ITEM_FROM_PRIZES);
  resolve([ownActive]);
  promote();
  expect(names(player1.active.energies.cards)).toContain(treasure);
  expect(player1.active.damage).toBe(0);
  expect(player1.energyPlayedTurn).toBe(0);
  expect(names(player1.hand.cards)).toEqual([grass]);
  expect(player1.prizesTaken).toBe(2);
});

it('takes face-up special cards as normal Prizes', () => {
  const { player1 } = start([dice, treasure, grass]);
  player1.prizes[0].faceUpPrize = true;
  player1.prizes[1].faceUpPrize = true;
  knockOut();
  promote();
  expect(names(player1.hand.cards)).toEqual([dice, treasure]);
  expect(player1.prizesTaken).toBe(2);
  expect(pending()).toBeUndefined();
});

it('preserves both original Prizes and resolves the win when no unreserved bonus Prize remains', () => {
  const { player1 } = start([dice, grass]);
  spyOn(Math, 'random').and.returnValue(0.1);
  knockOut();
  confirm(GameMessage.WANT_TO_USE_ITEM_FROM_PRIZES);
  animations();
  expect(store.state.winner).toBe(GameWinner.PLAYER_1);
  expect(names(player1.hand.cards)).toEqual([grass]);
  expect(names(player1.discard.cards)).toEqual([dice]);
  expect(player1.prizesTaken).toBe(2);
  expect(pending()).toBeUndefined();
});

it('reserves Prizes destined for discard before resolving a bonus from another simultaneous Knock Out', () => {
  const { player1 } = start([dice, grass, fire, water], {
    active: { card: 'Kyurem SFA', energy: [water, water, 'Metal Energy SVE', 'Metal Energy SVE', grass] },
  }, { active: { card: 'Dragapult ex TWM', damage: 220 },
    bench: [{ card: 'Hoppip EVS', tools: ['Billowing Smoke DAA'] }, { card: 'Mew ex MEW' }] });
  spyOn(Math, 'random').and.returnValue(0.1);
  store.dispatch(new AttackAction(player1.id, 'Trifrost'));
  animations();
  expect(pending() instanceof ChoosePokemonPrompt).toBe(true);
  const theirActive = { ...ownActive, player: PlayerType.TOP_PLAYER };
  resolve([theirActive, { ...theirActive, slot: SlotType.BENCH }]);
  animations();
  confirm(GameMessage.WANT_TO_USE_ITEM_FROM_PRIZES);
  animations();
  bonus([0, 1], 2);
  const promotion = pending();
  if (promotion instanceof ChoosePokemonPrompt && promotion.message === GameMessage.CHOOSE_NEW_ACTIVE_POKEMON) {
    resolve([{ ...ownActive, slot: SlotType.BENCH, index: 1 }]);
    animations();
  }
  expect(names(player1.hand.cards)).toEqual([water, grass]);
  expect(names(player1.discard.cards)).toContain(fire);
  expect(pending()).toBeUndefined();
});
