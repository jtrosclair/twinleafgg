import { ensureClientCards } from '../../client/cards';
import { CardManager } from '../../game/cards/card-manager';
import { AttackAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { MoveCardsEffect } from '../../game/store/effects/game-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { MoveEnergyPrompt } from '../../game/store/prompts/move-energy-prompt';
import { SelectPrompt } from '../../game/store/prompts/select-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { Store } from '../../game/store/store';
import { padDeck, PlayerConfig, setupGame } from './test-helpers';

const bog = 'Gapejaw Bog ASR';
const fish = 'Lumineon V BRS';
const eternatus = 'Radiant Eternatus CRZ';
const vmax = 'Corviknight VMAX BST';
const supporter = "Boss's Orders PAL";
const attacker = 'Regigigas ASR';
const basic = 'Hoppip EVS';
const moon = 'Lunatone OBF';
const sun = 'Solrock PGO';
const tingLu = 'Ting-Lu ex PAL';
const ownBench = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };
const board = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0 };
let store: Store;

beforeAll(ensureClientCards);
afterEach(() => store?.cleanup());

function start(first: Partial<PlayerConfig> = {}, second: Partial<PlayerConfig> = {}, stadium = bog) {
  const game = setupGame({
    turn: 5,
    player1: { active: { card: attacker }, deck: [supporter, ...padDeck(10)], ...first },
    player2: { active: { card: attacker }, deck: padDeck(10), ...second },
  });
  game.store.cleanup();
  if (stadium) game.player2.stadium.cards = [CardManager.getInstance().getCardByName(stadium)!];
  store = new Store({ onStateChange: () => undefined });
  store.restoreState(game.state);
  return game;
}

function pending() { return store.state.prompts.find(prompt => prompt.result === undefined); }
function resolve(raw: unknown) {
  const prompt = pending();
  if (!prompt) throw new Error('Expected a pending prompt');
  const result = prompt.decode(raw, store.state);
  if (!prompt.validate(result, store.state)) throw new Error(`Invalid result for ${prompt.type}`);
  store.dispatch(new ResolvePromptAction(prompt.id, result));
}

function chooseOrder(label: string) {
  const prompt = pending();
  if (!(prompt instanceof SelectPrompt)) throw new Error('Expected an effect order prompt');
  expect(String(prompt.message)).toBe('CHOOSE_BENCH_EFFECT_ORDER');
  expect(prompt.playerId).toBe(store.state.players[0].id);
  expect(prompt.options.allowCancel).toBe(false);
  const index = prompt.values.indexOf(label);
  if (index < 0) throw new Error(`Missing ${label} from ${prompt.values.join(', ')}`);
  resolve(index);
}

function settleAutomaticPrompts() {
  while (true) {
    const next = pending();
    if (!next) return;
    if (next instanceof WaitPrompt || next instanceof ShowCardsPrompt) resolve(true);
    else if (next instanceof ShuffleDeckPrompt) {
      const player = store.state.players.find(candidate => candidate.id === next.playerId)!;
      resolve(Array.from({ length: next.count ?? player.deck.cards.length }, (_, index) => index));
    }
    else return;
  }
}

function play(target = ownBench) {
  store.dispatch(new PlayCardAction(store.state.players[0].id, 0, target));
}

describe('Gapejaw Bog and a newly Benched Pokémon’s Ability', () => {
  it('lets the owner resolve Luminous Sign before the counters against Ting-Lu ex', () => {
    const { player1 } = start({ hand: [fish] }, { active: { card: tingLu } });
    play();
    expect(player1.bench[0].damage).toBe(0);
    chooseOrder('Luminous Sign');
    expect(pending() instanceof ConfirmPrompt).toBe(true);
    resolve(true);
    expect(pending() instanceof ChooseCardsPrompt).toBe(true);
    expect(player1.bench[0].damage).toBe(0);
    resolve([0]);
    settleAutomaticPrompts();
    expect(player1.hand.cards.map(card => card.fullName)).toEqual([supporter]);
    expect(player1.bench[0].damage).toBe(20);
    expect(pending()).toBeUndefined();
  });

  it('suppresses Luminous Sign if the owner resolves the Bog first', () => {
    const { player1 } = start({ hand: [fish] }, { active: { card: tingLu } });
    play();
    chooseOrder('Gapejaw Bog');
    expect(player1.bench[0].damage).toBe(20);
    expect(player1.hand.cards).toEqual([]);
    expect(pending()).toBeUndefined();
  });

  it('still applies the Bog if Luminous Sign is declined', () => {
    const { player1 } = start({ hand: [fish] });
    play();
    chooseOrder('Luminous Sign');
    resolve(false);
    expect(player1.bench[0].damage).toBe(20);
    expect(pending()).toBeUndefined();
  });

  it('offers the usual Ability confirmation when the Bog is absent', () => {
    const { player1 } = start({ hand: [fish] }, {}, '');
    play();
    expect(pending() instanceof ConfirmPrompt).toBe(true);
    resolve(false);
    expect(player1.bench[0].damage).toBe(0);
  });

  it('omits the order choice when New Moon already blocks the Stadium', () => {
    const { player1 } = start({ hand: [fish], bench: [{ card: moon }, { card: sun }] });
    play({ ...ownBench, index: 2 });
    expect(pending() instanceof ConfirmPrompt).toBe(true);
    resolve(false);
    expect(player1.bench[2].damage).toBe(0);
  });

  it('omits a suppressed Ability when checking the order', () => {
    const { player1 } = start({ hand: [fish] }, { active: { card: 'Galarian Weezing SHF' } });
    play();
    expect(pending()).toBeUndefined();
    expect(player1.bench[0].damage).toBe(20);
  });

  for (const first of ['Dedechange', "Team Magma's Secret Base"]) {
    it(`honors ${first} first with Dedenne-GX under Shadow Box`, () => {
      const { player1 } = start(
        { hand: ['Dedenne-GX UNB', basic] }, { bench: [{ card: 'Mimikyu CEC 97' }] }, "Team Magma's Secret Base DCR",
      );
      play();
      chooseOrder(first);
      if (first === 'Dedechange') resolve(true);
      expect(player1.hand.cards.length).toBe(first === 'Dedechange' ? 6 : 1);
      expect(player1.bench[0].damage).toBe(20);
      expect(pending()).toBeUndefined();
    });
  }

  for (const first of ['Climactic Gate', 'Gapejaw Bog']) {
    it(`resolves ${first} first and finishes both before ending the turn`, () => {
      const { player1 } = start({ hand: [eternatus], deck: [vmax, ...padDeck(10)] });
      play();
      chooseOrder(first);
      expect(player1.bench[0].damage).toBe(first === 'Climactic Gate' ? 0 : 20);
      resolve(true);
      expect(pending() instanceof ChooseCardsPrompt).toBe(true);
      resolve([0]);
      settleAutomaticPrompts();
      expect(pending()).toBeUndefined();
      expect(player1.bench[0].damage).toBe(20);
      expect(player1.bench[1].getPokemonCard()?.fullName).toBe(vmax);
      expect(player1.bench[1].damage).toBe(0);
      expect(store.state.turn).toBe(6);
      expect(store.state.activePlayer).toBe(1);
    });
  }

  it('shuffles and ends the turn after using Climactic Gate and finding zero VMAX', () => {
    const { player1 } = start({ hand: [eternatus] });
    play();
    chooseOrder('Climactic Gate');
    resolve(true);
    resolve([]);
    expect(pending()?.type).toBe('Shuffle deck');
    settleAutomaticPrompts();
    expect(player1.bench[0].damage).toBe(20);
    expect(store.state.turn).toBe(6);
  });

  it('keeps the turn if Climactic Gate is declined', () => {
    const { player1 } = start({ hand: [eternatus] });
    play();
    chooseOrder('Climactic Gate');
    resolve(false);
    expect(player1.bench[0].damage).toBe(20);
    expect(store.state.turn).toBe(5);
  });

  it('still ends the turn after Climactic Gate when no Stadium is in play', () => {
    const { player1 } = start({ hand: [eternatus], deck: [vmax, ...padDeck(10)] }, {}, '');
    play();
    expect(pending() instanceof ConfirmPrompt).toBe(true);
    resolve(true);
    resolve([0]);
    settleAutomaticPrompts();
    expect(store.state.turn).toBe(6);
    expect(player1.bench[0].damage).toBe(0);
  });

  it('resolves Rapid Vernier before the counters and keeps the counters on Iron Leaves ex', () => {
    const { player1 } = start({ hand: ['Iron Leaves ex TEF'] });
    play();
    chooseOrder('Rapid Vernier');
    resolve(true);
    expect(player1.active.getPokemonCard()?.fullName).toBe('Iron Leaves ex TEF');
    expect(player1.active.damage).toBe(20);
    expect(player1.bench[0].damage).toBe(0);
  });

  it('finishes Rapid Vernier’s Energy transfer before applying the Stadium', () => {
    const { player1 } = start({
      active: { card: attacker, energy: ['Grass Energy SVE'] },
      bench: [{ card: basic, energy: ['Water Energy SVE'] }],
      hand: ['Iron Leaves ex TEF'],
    });
    play({ ...ownBench, index: 1 });
    chooseOrder('Rapid Vernier');
    resolve(true);
    expect(pending() instanceof MoveEnergyPrompt).toBe(true);
    expect(player1.active.damage).toBe(0);
    const to = { ...ownBench, slot: SlotType.ACTIVE };
    const transfers = [0, 1].map(index => {
      const source = player1.bench[index];
      const card = source.energies.cards[0];
      return { from: { ...ownBench, index }, to, index: MoveEnergyPrompt.sourceCards(source).indexOf(card) };
    });
    resolve(transfers);
    expect(player1.active.energies.cards.map(card => card.fullName).sort()).toEqual(['Grass Energy SVE', 'Water Energy SVE']);
    expect(player1.bench.slice(0, 2).flatMap(slot => slot.energies.cards)).toEqual([]);
    expect(player1.active.damage).toBe(20);
  });

  it('lets Pumpkin Pit discard the Stadium first', () => {
    const { player1, player2 } = start({ hand: ['Pumpkaboo EVS'] });
    play();
    chooseOrder('Pumpkin Pit');
    resolve(true);
    expect(player2.discard.cards.some(card => card.fullName === bog)).toBe(true);
    expect(player1.bench[0].damage).toBe(0);
  });

  it('keeps the counters when the Bog resolves before Pumpkin Pit', () => {
    const { player1, player2 } = start({ hand: ['Pumpkaboo EVS'] });
    play();
    chooseOrder('Gapejaw Bog');
    resolve(true);
    expect(player2.discard.cards.some(card => card.fullName === bog)).toBe(true);
    expect(player1.bench[0].damage).toBe(20);
  });
});

describe('Gapejaw Bog and effect-driven hand placement', () => {
  const puff = 'Captivating Poké Puff STS';

  for (const [trainer, becomesActive] of [[puff, false], ["Erika's Perfume G1", false], ["Erika's Invitation MEW", true]] as const) {
    it(`places counters when ${trainer} puts a Basic from the opponent’s hand into play`, () => {
      const { player2 } = start({ hand: [trainer] }, { hand: [fish] });
      play(board);
      settleAutomaticPrompts();
      resolve([0]);
      expect(pending()).toBeUndefined();
      const target = becomesActive ? player2.active : player2.bench[0];
      expect(target.getPokemonCard()?.fullName).toBe(fish);
      expect(target.damage).toBe(20);
    });
  }

  it('checks New Moon after simultaneous placements complete', () => {
    const { player2 } = start({ hand: [puff] }, { hand: [moon, sun, basic] });
    play(board);
    settleAutomaticPrompts();
    resolve([0, 1, 2]);
    expect(player2.bench.slice(0, 3).map(slot => slot.getPokemonCard()?.fullName)).toEqual([moon, sun, basic]);
    expect(player2.bench.slice(0, 3).map(slot => slot.damage)).toEqual([0, 0, 0]);
  });

  it('applies the Bog to a Basic placed by the Mawile-GX Ability', () => {
    const { player1, player2 } = start({ hand: ['Mawile-GX UNM'] }, { hand: [basic] });
    play();
    chooseOrder('Captivating Wink');
    resolve(true);
    settleAutomaticPrompts();
    resolve([0]);
    expect(player1.bench[0].damage).toBe(20);
    expect(player2.bench[0].damage).toBe(20);
    expect(pending()).toBeUndefined();
  });

  it('applies the Bog to a Basic placed by Irresistible Aroma', () => {
    const { player1, player2 } = start(
      { active: { card: 'Gloom UNB' } },
      { hand: [basic] },
    );
    store.dispatch(new UseAbilityAction(player1.id, 'Irresistible Aroma', { ...ownBench, slot: SlotType.ACTIVE }));
    settleAutomaticPrompts();
    if (pending()?.type === 'Coin flip') resolve(true);
    settleAutomaticPrompts();
    resolve([0]);
    expect(player2.bench[0].getPokemonCard()?.fullName).toBe(basic);
    expect(player2.bench[0].damage).toBe(20);
  });

  it('applies the Bog to both Basics moved by Pulling Currents', () => {
    const { player1, player2 } = start(
      { active: { card: 'Manaphy SWSH', energy: ['Water Energy SVE'] } },
      { hand: [basic, 'Squirtle MEW'] },
    );
    store.dispatch(new AttackAction(player1.id, 'Pulling Currents'));
    resolve([0, 1]);
    settleAutomaticPrompts();
    expect(player2.bench.slice(0, 2).map(slot => slot.damage)).toEqual([20, 20]);
  });

  for (const stadium of [bog, "Team Magma's Secret Base DCR"]) {
    it(`stacks ${stadium} with Dark Invitation’s counters`, () => {
      const { player1, player2 } = start({ active: { card: 'Dusknoir BUS' } }, { hand: ['Squirtle MEW'] }, stadium);
      store.dispatch(new UseAbilityAction(player1.id, 'Dark Invitation', { ...ownBench, slot: SlotType.ACTIVE }));
      resolve([0]);
      expect(player2.bench[0].damage).toBe(50);
    });
  }

  it('applies the Bog before Fin Luster switches the Pokémon in', () => {
    const { player1, player2 } = start({ active: { card: 'Lumineon SF' } }, { hand: [basic] });
    store.dispatch(new UseAbilityAction(player1.id, player1.active.getPokemonCard()!.powers[0].name,
      { ...ownBench, slot: SlotType.ACTIVE }));
    settleAutomaticPrompts();
    resolve([0]);
    expect(player2.active.getPokemonCard()?.fullName).toBe(basic);
    expect(player2.active.damage).toBe(20);
  });

  it('handles successful MoveCardsEffect placements and ignores a repeated move', () => {
    const { player2 } = start({}, { hand: [basic] });
    const card = player2.hand.cards[0];
    const effect = new MoveCardsEffect(player2.hand, player2.bench[0], { cards: [card] });
    store.reduceEffect(store.state, effect);
    store.reduceEffect(store.state, effect);
    expect(player2.bench[0].damage).toBe(20);
    expect(player2.bench[0].pokemonPlayedTurn).toBe(5);
  });

  it('leaves a Basic placed from the deck unaffected', () => {
    const { player1 } = start({ hand: ['Nest Ball SVI'], deck: [fish, ...padDeck(10)] });
    play(board);
    resolve([0]);
    settleAutomaticPrompts();
    expect(pending()).toBeUndefined();
    expect(player1.bench[0].getPokemonCard()?.fullName).toBe(fish);
    expect(player1.bench[0].damage).toBe(0);
  });

  for (const substitute of ['Robo Substitute PHF', 'Robo Substitute Team Flare Gear PHF']) {
    it(`counts ${substitute} when it is played as a Basic Pokémon`, () => {
      const { player1 } = start({ hand: [substitute] }, {}, "Team Magma's Secret Base DCR");
      play(board);
      expect(player1.bench[0].getPokemonCard()?.fullName).toBe(substitute);
      expect(player1.bench[0].damage).toBe(20);
    });
  }
});
