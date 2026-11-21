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

function start(prizes: string[], left: Partial<PlayerConfig> = {}, right: Partial<PlayerConfig> = {}, stadium?: string) {
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
  if (stadium) {
    const card = getCardByName(stadium);
    card.id = 600;
    game.player2.stadium.cards = [card];
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

describe('Basic Pokémon that enter from an awarded Prize', () => {
  const ruins = 'Risky Ruins MEG';
  const moon = 'Lunatone OBF';
  const sun = 'Solrock PGO';

  for (const [stadium, protectedFromRuins, damage] of [[ruins, false, 20], [ruins, true, 0], ['Gapejaw Bog ASR', false, 0], ['Miasma Valley PL', false, 0]] as const) {
    it(`resolves Lucky Bonus with ${stadium}${protectedFromRuins ? ' and New Moon' : ''}`, () => {
      const { player1 } = start([chansey, grass, water, fire],
        { bench: protectedFromRuins ? [{ card: moon }, { card: sun }] : [] }, {}, stadium);
      spyOn(Math, 'random').and.returnValue(0.1);
      knockOut();
      confirm(GameMessage.WANT_TO_USE_ABILITY_FROM_PRIZES);
      animations();
      const target = player1.bench[protectedFromRuins ? 2 : 0];
      expect(target.getPokemonCard()?.fullName).toBe(chansey);
      expect(target.damage).toBe(damage);
      bonus([0], 1);
      promote();
      expect(names(player1.hand.cards)).toEqual([water, grass]);
      expect(player1.prizesTaken).toBe(3);
      expect(pending()).toBeUndefined();
    });
  }

  it('can use Lucky Bonus while Silent Lab is in play', () => {
    const { player1 } = start([chansey, grass, water], {}, {}, 'Silent Lab PRC');
    spyOn(Math, 'random').and.returnValue(0.9);
    knockOut();
    confirm(GameMessage.WANT_TO_USE_ABILITY_FROM_PRIZES);
    animations();
    promote();
    expect(player1.bench[0].getPokemonCard()?.fullName).toBe(chansey);
    expect(player1.prizesTaken).toBe(2);
    expect(pending()).toBeUndefined();
  });

  for (const print of [jirachi, 'Jirachi Prism Star CES']) {
    it(`puts counters on ${print} and keeps its bonus Prize`, () => {
      const { player1 } = start([print, grass, water, fire], {}, {}, ruins);
      knockOut();
      confirm(GameMessage.WANT_TO_USE_ABILITY_FROM_PRIZES);
      expect(player1.bench[0].getPokemonCard()?.fullName).toBe(print);
      expect(player1.bench[0].damage).toBe(20);
      bonus([0], 1);
      promote();
      expect(names(player1.hand.cards)).toEqual([water, grass]);
      expect(player1.prizesTaken).toBe(3);
      expect(pending()).toBeUndefined();
    });
  }

  it('recognizes a Basic placed from the deck by Dream Ball during Prize resolution', () => {
    const basic = 'Hoppip EVS';
    const { player1 } = start([dream, grass, water], { deck: [basic, ...padDeck(7)] }, {}, ruins);
    knockOut();
    confirm(GameMessage.WANT_TO_USE_ITEM_FROM_PRIZES);
    expect(pending() instanceof ChooseCardsPrompt).toBe(true);
    resolve([0]);
    expect(pending() instanceof ShuffleDeckPrompt).toBe(true);
    resolve(player1.deck.cards.map((_, index) => index));
    promote();
    expect(player1.bench[0].getPokemonCard()?.fullName).toBe(basic);
    expect(player1.bench[0].damage).toBe(20);
    expect(player1.prizesTaken).toBe(2);
  });

  for (const stadium of [ruins, 'Path to the Peak CRE']) {
    it(`uses Eternal Zone's live restriction with ${stadium}`, () => {
      const { player1 } = start([jirachi, grass, water, fire], {
        active: { card: 'Eternatus VMAX DAA', energy: ['Darkness Energy SVE', water] },
        bench: [{ card: 'Poochyena ASC' }],
      }, { active: { card: 'Dragapult ex TWM', damage: 300 } }, stadium);
      store.dispatch(new AttackAction(player1.id, 'Dread End'));
      animations();
      if (stadium === 'Path to the Peak CRE') {
        confirm(GameMessage.WANT_TO_USE_ABILITY_FROM_PRIZES);
        bonus([0], 1);
        expect(player1.bench[1].getPokemonCard()?.fullName).toBe(jirachi);
        expect(player1.prizesTaken).toBe(3);
      } else {
        expect(names(player1.hand.cards)).toEqual([jirachi, grass]);
        expect(player1.bench[1].getPokemonCard()).toBeUndefined();
        expect(player1.prizesTaken).toBe(2);
      }
      promote();
      expect(pending()).toBeUndefined();
    });
  }
});

describe('Prize destination replacements', () => {
  const barbaracle = 'Barbaracle LOR';
  const smoke = 'Billowing Smoke DAA';

  it('counts face-up Lost Zone Prizes and prevents the Treasure Energy attachment', () => {
    const { player1 } = start([treasure, grass, water], {}, { bench: [{ card: barbaracle }] });
    knockOut();
    promote();
    expect(names(player1.lostzone.cards)).toEqual([treasure, grass]);
    expect(names(player1.hand.cards)).toEqual([]);
    expect(names(player1.active.energies.cards)).not.toContain(treasure);
    expect(player1.prizesTaken).toBe(2);
    expect(player1.gameStats.prizesTakenCount).toBe(2);
    expect(pending()).toBeUndefined();
  });

  it('leaves both players’ ordinary Prize destinations alone when the taker owns Barbaracle', () => {
    const { player1 } = start([grass, fire, water], { bench: [{ card: barbaracle }] });
    knockOut();
    promote();
    expect(names(player1.hand.cards)).toEqual([grass, fire]);
    expect(player1.lostzone.cards).toEqual([]);
    expect(player1.prizesTaken).toBe(2);
  });

  it('takes the Prize into hand when Barbaracle itself is Knocked Out', () => {
    const { player1 } = start([grass, water], {}, { active: { card: barbaracle, damage: 110 } });
    knockOut();
    promote();
    expect(names(player1.hand.cards)).toEqual([grass]);
    expect(player1.lostzone.cards).toEqual([]);
    expect(player1.prizesTaken).toBe(1);
  });

  for (const discardSelection of [[], [1], [0, 1]]) {
    it(`resolves both Lost Block and Billowing Smoke with discard indices [${discardSelection}]`, () => {
      const { player1 } = start([chansey, treasure, water], {}, {
        active: { card: 'Dragapult ex TWM', damage: 280, tools: [smoke] },
        bench: [{ card: barbaracle }],
      });
      knockOut();
      const prompt = pending();
      if (!(prompt instanceof ChooseCardsPrompt)) throw new Error('Expected the Prize destination choice');
      expect(String(prompt.message)).toBe('CHOOSE_PRIZES_TO_DISCARD_OR_LOST_ZONE');
      expect(prompt.playerId).toBe(player1.id);
      expect(names(prompt.cards.cards)).toEqual([chansey, treasure]);
      expect(player1.prizesTaken).toBe(0);
      resolve(discardSelection);
      promote();
      expect(names(player1.discard.cards)).toEqual([chansey, treasure].filter((_, index) => discardSelection.includes(index)));
      expect(names(player1.lostzone.cards)).toEqual([chansey, treasure].filter((_, index) => !discardSelection.includes(index)));
      expect(player1.hand.cards).toEqual([]);
      expect(player1.bench[0].getPokemonCard()).toBeUndefined();
      expect(player1.prizesTaken).toBe(2);
      expect(pending()).toBeUndefined();
    });
  }

  it('uses the Prism Star discard rule and suppresses both Prize Abilities under Billowing Smoke alone', () => {
    const { player1 } = start([jirachi, chansey, water], {}, {
      active: { card: 'Dragapult ex TWM', damage: 280, tools: [smoke] },
    });
    knockOut();
    promote();
    expect(names(player1.lostzone.cards)).toEqual([jirachi]);
    expect(names(player1.discard.cards)).toEqual([chansey]);
    expect(player1.bench[0].getPokemonCard()).toBeUndefined();
    expect(player1.prizesTaken).toBe(2);
    expect(pending()).toBeUndefined();
  });

  it('keeps normal Prizes when only attack counters Knock Out the Pokémon wearing Billowing Smoke', () => {
    const { player1 } = start([grass, water], {
      active: { card: 'Dragapult ex TWM', energy: [fire, 'Psychic Energy SVE'] },
    }, {
      active: { card: 'Charizard ex OBF' },
      bench: [{ card: 'Hoppip EVS', tools: [smoke] }],
    });
    store.dispatch(new AttackAction(player1.id, 'Phantom Dive'));
    animations();
    expect(pending()?.type).toBe('Put damage');
    resolve([{ target: { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 }, damage: 60 }]);
    animations();
    expect(names(player1.hand.cards)).toEqual([grass]);
    expect(names(player1.discard.cards)).toEqual([]);
    expect(player1.prizesTaken).toBe(1);
    expect(pending()).toBeUndefined();
  });

  it('ignores a suppressed Billowing Smoke', () => {
    const { player1 } = start([grass, fire, water], {}, {
      active: { card: 'Dragapult ex TWM', damage: 280, tools: [smoke] },
    }, 'Jamming Tower TWM');
    knockOut();
    promote();
    expect(names(player1.hand.cards)).toEqual([grass, fire]);
    expect(player1.discard.cards).toEqual([]);
    expect(player1.prizesTaken).toBe(2);
  });

  it("redirects Prizes taken by Slowbro's Twilight Inspiration", () => {
    const { player1 } = start([grass, fire, water], {
      active: { card: 'Slowbro PGO', energy: [water, water] },
    }, { bench: [{ card: barbaracle }], prizeCount: 1 });
    store.dispatch(new AttackAction(player1.id, 'Twilight Inspiration'));
    animations();
    expect(pending() instanceof ChoosePrizePrompt).toBe(true);
    resolve([0, 1]);
    animations();
    expect(names(player1.lostzone.cards)).toEqual([grass, fire]);
    expect(player1.hand.cards).toEqual([]);
    expect(player1.prizesTaken).toBe(2);
    expect(pending()).toBeUndefined();
  });

  it('counts the final Prize under Lost Block before resolving the win', () => {
    const { player1 } = start([grass, water], {}, { bench: [{ card: barbaracle }] });
    knockOut();
    expect(store.state.winner).toBe(GameWinner.PLAYER_1);
    expect(names(player1.lostzone.cards)).toEqual([grass, water]);
    expect(player1.prizesTakenThisTurn).toBe(2);
    expect(pending()).toBeUndefined();
  });
});
