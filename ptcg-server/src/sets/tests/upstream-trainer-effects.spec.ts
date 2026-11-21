import { ensureClientCards } from '../../client/cards';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { AttackAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { CardManager } from '../../game/cards/card-manager';
import { SpecialCondition, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { MoveEnergyPrompt } from '../../game/store/prompts/move-energy-prompt';
import { SelectOptionPrompt } from '../../game/store/prompts/select-option-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { Store } from '../../game/store/store';
import { padDeck, PlayerConfig, setupGame } from './test-helpers';

const pow = 'Pow! Hand Extension TRR';
const omega = 'Primal Groudon-EX PRC';
const galvantula = 'Galvantula TEU';
const regigigas = 'Regigigas ASR';
const hoppip = 'Hoppip EVS';
const water = 'Water Energy SVE';
const mist = 'Mist Energy TEF';
const special = 'Double Turbo Energy BRS';
const prime = 'Prime Catcher TEF';
const counter = 'Counter Catcher PAR';
const cross = 'Cross Switcher FST';
const custom = 'Custom Catcher LOT';
const lisia = "Lisia's Appeal SSP";
const giovanni = "Team Rocket's Giovanni DRI";
const mewtwo = "Team Rocket's Mewtwo ex DRI";
const koffing = "Team Rocket's Koffing DRI";
const board = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0 };
const enemyActive = { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const enemyBench = { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 };
let store: Store;

beforeAll(ensureClientCards);
afterEach(() => store?.cleanup());

function start(trainer: string, opposing: Partial<PlayerConfig>, own: Partial<PlayerConfig> = {}) {
  const game = setupGame({
    turn: 5,
    player1: { active: { card: regigigas }, hand: [trainer], deck: padDeck(10), ...own },
    player2: { active: { card: regigigas }, deck: padDeck(10), prizeCount: 4, ...opposing },
  });
  game.store.cleanup();
  store = new Store({ onStateChange: () => undefined });
  store.state = game.state;
  return game;
}

function play() { store.dispatch(new PlayCardAction(store.state.players[0].id, 0, board)); }
function pending() { return store.state.prompts.find(prompt => prompt.result === undefined); }
function resolve(raw: unknown) {
  const prompt = pending();
  if (!prompt) throw new Error('Expected a pending prompt');
  const result = prompt.decode(raw, store.state);
  if (!prompt.validate(result, store.state)) throw new Error(`Invalid result for ${prompt.type}`);
  store.dispatch(new ResolvePromptAction(prompt.id, result));
}
function chooseBench(player: PlayerType, index = 0) {
  expect(pending() instanceof ChoosePokemonPrompt).toBe(true);
  resolve([{ player, slot: SlotType.BENCH, index }]);
}

describe('Trainer switch and Energy movement', () => {
  for (const [source, destination] of [[regigigas, hoppip], [omega, hoppip], [regigigas, omega]]) {
    it(`POW! resolves one Energy transfer from ${source} to ${destination}`, () => {
      const { player1, player2 } = start(pow, {
        active: { card: source, energy: [special, water] }, bench: [{ card: destination }],
      });
      const energy = player2.active.energies.cards[0];
      play();
      expect(pending() instanceof SelectOptionPrompt).toBe(true);
      resolve(0);
      expect(pending() instanceof MoveEnergyPrompt).toBe(true);
      resolve([{ from: enemyActive, to: enemyBench, index: 1 }]);
      const zone = source === omega ? player2.active.energies : destination === omega
        ? player2.discard : player2.bench[0].energies;
      expect(zone.cards.includes(energy)).toBe(true);
      expect(player2.active.energies.cards.includes(energy)).toBe(source === omega);
      expect(player2.active.energies.cards.some(card => card.fullName === water)).toBe(true);
      expect(player1.discard.cards.map(card => card.fullName)).toEqual([pow]);
      expect(pending()).toBeUndefined();
    });
  }

  it('POW! omits its Energy choice with no attachment and can select a protected switch target', () => {
    const { player1, player2 } = start(pow, { bench: [{ card: omega }] });
    const original = player2.active;
    play();
    chooseBench(PlayerType.TOP_PLAYER);
    expect(player2.active === original).toBe(true);
    expect(player1.discard.cards.map(card => card.fullName)).toEqual([pow]);
  });

  it('POW! rejects a missing Bench or an equal Prize count', () => {
    let game = start(pow, { active: { card: regigigas, energy: [water] } });
    expect(() => play()).toThrow(new GameError(GameMessage.CANNOT_PLAY_THIS_CARD));
    expect(game.player1.hand.cards[0].fullName).toBe(pow);
    store.cleanup();
    game = start(pow, { prizeCount: 6, bench: [{ card: hoppip }] });
    expect(() => play()).toThrow(new GameError(GameMessage.CANNOT_PLAY_THIS_CARD));
    expect(game.player1.hand.cards[0].fullName).toBe(pow);
  });

  it('POW! accepts a mirror-only attachment and validates the opposing extended Bench', () => {
    const { player2 } = start(pow, {
      active: { card: regigigas, energy: [water] }, bench: [{ card: hoppip, energy: [special] }],
    });
    const energy = player2.active.energies.cards[0];
    player2.active.cards.splice(player2.active.cards.indexOf(energy), 1);
    player2.bench.push(new PokemonCardList(), new PokemonCardList(), new PokemonCardList());
    const target = player2.bench[7];
    target.cards.push(CardManager.getInstance().getCardByName(hoppip)!);
    const areaZero = CardManager.getInstance().getCardByName('Area Zero Underdepths SCR')!;
    player2.stadium.cards.push(areaZero);
    player2.bench[1].cards.push(CardManager.getInstance().getCardByName('Terapagos ex SCR')!);
    play();
    resolve(0);
    const prompt = pending() as MoveEnergyPrompt;
    const choice = { from: enemyActive, to: { ...enemyBench, index: 7 }, index: 1 };
    expect(prompt.validate([], store.state)).toBe(false);
    expect(prompt.validate(prompt.decode([{ ...choice, index: 0 }], store.state), store.state)).toBe(false);
    expect(prompt.validate(prompt.decode([{ ...choice, to: enemyActive }], store.state), store.state)).toBe(false);
    expect(prompt.validate(prompt.decode([{ ...choice, from: enemyBench }], store.state), store.state)).toBe(false);
    expect(prompt.validate(prompt.decode([{ ...choice, to: { ...enemyBench, index: 6 } }], store.state), store.state)).toBe(false);
    resolve([choice]);
    expect(target.cards.includes(energy)).toBe(true);
    expect(target.energies.cards.includes(energy)).toBe(true);
    expect(player2.active.energies.cards.includes(energy)).toBe(false);
  });

  for (const trainer of [prime, cross, custom, counter]) {
    for (const protectedTarget of [false, true]) {
      it(`${trainer} consumes the required Items and resolves the ${protectedTarget ? 'protected' : 'unprotected'} switch`, () => {
        const count = trainer === cross || trainer === custom ? 2 : 1;
        const { player1, player2 } = start(trainer, { bench: [{ card: protectedTarget ? omega : hoppip }] }, {
          hand: Array(count).fill(trainer), bench: [{ card: hoppip }],
        });
        const oldOwn = player1.active;
        const oldEnemy = player2.active;
        play();
        if (trainer === custom) {
          expect(pending() instanceof ConfirmPrompt).toBe(true);
          resolve(true);
        }
        chooseBench(PlayerType.TOP_PLAYER);
        const secondSwitch = !protectedTarget && (trainer === cross || trainer === prime);
        if (secondSwitch) chooseBench(PlayerType.BOTTOM_PLAYER);
        expect(player1.active === oldOwn).toBe(!secondSwitch);
        expect(player2.active === oldEnemy).toBe(protectedTarget);
        expect(player1.discard.cards.map(card => card.fullName)).toEqual(Array(count).fill(trainer));
        expect(pending()).toBeUndefined();
      });
    }
  }

  it('Prime Catcher rejects an empty opposing Bench and works with an empty own Bench', () => {
    let game = start(prime, {}, { bench: [{ card: hoppip }] });
    expect(() => play()).toThrow(new GameError(GameMessage.CANNOT_PLAY_THIS_CARD));
    expect(game.player1.hand.cards[0].fullName).toBe(prime);
    store.cleanup();
    game = start(prime, { bench: [{ card: hoppip }] });
    const target = game.player2.bench[0];
    play();
    chooseBench(PlayerType.TOP_PLAYER);
    expect(game.player2.active === target).toBe(true);
    expect(pending()).toBeUndefined();
  });

  for (const trainer of ['Repel SUM', 'Repel M1L', 'Escape Rope BST', 'Escape Rope PLS']) {
    for (const protectsActive of [false, true]) {
      it(`${trainer} resolves protection on the departing Active (${protectsActive})`, () => {
        const { player1, player2 } = start(trainer, {
          active: { card: protectsActive ? omega : regigigas }, bench: [{ card: protectsActive ? hoppip : omega }],
        }, { bench: [{ card: hoppip }] });
        const isRope = trainer.startsWith('Escape Rope');
        const oldOwn = player1.active;
        const oldEnemy = player2.active;
        expect((player1.hand.cards[0] as TrainerCard).trainerType).toBe(TrainerType.ITEM);
        play();
        if (!protectsActive) {
          expect(pending()?.playerId).toBe(player2.id);
          chooseBench(PlayerType.BOTTOM_PLAYER);
        }
        if (isRope) {
          expect(pending()?.playerId).toBe(player1.id);
          chooseBench(PlayerType.BOTTOM_PLAYER);
        }
        expect(player1.active === oldOwn).toBe(!isRope);
        expect(player2.active === oldEnemy).toBe(protectsActive);
        expect(player1.supportersPlayedThisTurn ?? 0).toBe(0);
        expect(pending()).toBeUndefined();
      });
    }
  }

  for (const trainer of ['Toy Catcher EVS', 'Mega Catcher FCO']) {
    it(`${trainer} preserves its selection restriction and respects Ω Barrier`, () => {
      const { player2 } = start(trainer, { bench: [{ card: omega, damage: 190 }, { card: regigigas }] });
      const original = player2.active;
      play();
      const choose = pending() as ChoosePokemonPrompt;
      const invalid = [{ ...enemyBench, index: 1 }];
      expect(choose.validate(choose.decode(invalid, store.state), store.state)).toBe(false);
      chooseBench(PlayerType.TOP_PLAYER);
      expect(player2.active === original).toBe(true);
    });
  }

  it('Lisia’s Appeal rejects a Bench with no Basic Pokémon before using a Supporter', () => {
    const { player1 } = start(lisia, { bench: [{ card: galvantula }] });
    expect(() => play()).toThrow(new GameError(GameMessage.CANNOT_PLAY_THIS_CARD));
    expect(player1.hand.cards[0].fullName).toBe(lisia);
    expect(player1.supportersPlayedThisTurn ?? 0).toBe(0);
  });

  it('Lisia’s Appeal lets Princess’s Curtain prevent both parts of the effect', () => {
    const { player2 } = start(lisia, { active: { card: 'Diancie ASR' }, bench: [{ card: hoppip }] });
    const original = player2.active;
    const target = player2.bench[0];
    play();
    chooseBench(PlayerType.TOP_PLAYER);
    expect(player2.active === original).toBe(true);
    expect(target.specialConditions).toEqual([]);
  });

  for (const hasFestival of [false, true]) {
    it(`Lisia’s Appeal checks Special Condition immunity after the switch (${hasFestival})`, () => {
      const { player1, player2 } = start(lisia, { bench: [{ card: hoppip, energy: [water] }] });
      if (hasFestival) player1.stadium.cards.push(CardManager.getInstance().getCardByName('Festival Grounds TWM')!);
      const target = player2.bench[0];
      play();
      chooseBench(PlayerType.TOP_PLAYER);
      expect(player2.active === target).toBe(true);
      expect(target.specialConditions).toEqual(hasFestival ? [] : [SpecialCondition.CONFUSED]);
    });
  }

  it('Bewitching Eyes cannot switch a target protected from copied Lisia’s Appeal', () => {
    const { player1, player2 } = start(lisia, { bench: [{ card: hoppip, energy: [mist] }], discard: [lisia] }, {
      active: { card: 'Sableye AOR', energy: ['Darkness Energy SVE'] }, hand: [],
    });
    const original = player2.active;
    store.dispatch(new AttackAction(player1.id, 'Bewitching Eyes'));
    resolve([0]);
    chooseBench(PlayerType.TOP_PLAYER);
    while (pending() instanceof WaitPrompt) resolve(true);
    expect(player2.active === original).toBe(true);
    expect(pending()).toBeUndefined();
  });

  for (const enemy of [undefined, omega, hoppip]) {
    it(`Team Rocket’s Giovanni switches your Pokémon with opposing Bench target ${enemy ?? 'absent'}`, () => {
      const { player1, player2 } = start(giovanni, { bench: enemy ? [{ card: enemy }] : [] }, {
        active: { card: mewtwo }, bench: [{ card: koffing }, { card: hoppip }],
      });
      const oldEnemy = player2.active;
      const own = player1.bench[0];
      play();
      chooseBench(PlayerType.BOTTOM_PLAYER);
      expect(player1.active === own).toBe(true);
      if (enemy) chooseBench(PlayerType.TOP_PLAYER);
      expect(player2.active === oldEnemy).toBe(enemy !== hoppip);
      expect(player1.discard.cards[0].fullName).toBe(giovanni);
      expect(player1.rocketSupporter).toBe(true);
      expect(pending()).toBeUndefined();
    });
  }

  it('A rejected Giovanni play leaves the Supporter and Team Rocket flag untouched', () => {
    const { player1 } = start(giovanni, { bench: [{ card: hoppip }] }, { bench: [{ card: koffing }] });
    expect(() => play()).toThrow(new GameError(GameMessage.CANNOT_PLAY_THIS_CARD));
    expect(player1.hand.cards[0]?.fullName).toBe(giovanni);
    expect(player1.rocketSupporter).toBe(false);
  });
});
