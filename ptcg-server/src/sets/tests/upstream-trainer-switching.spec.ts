import { ensureClientCards } from '../../client/cards';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { AttackAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { CardManager } from '../../game/cards/card-manager';
import { Format } from '../../game/store/card/card-types';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { SelectPrompt } from '../../game/store/prompts/select-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { Store } from '../../game/store/store';
import { padDeck, PlayerConfig, setupGame } from './test-helpers';

const catcher = 'Pokemon Catcher SVI';
const boss = "Boss's Orders PAL";
const gust = 'Gust of Wind BS';
const lysandre = 'Lysandre FLF';
const guzma = 'Guzma BUS';
const serena = 'Serena SIT';
const ryme = 'Ryme OBF';
const doubleGust = 'Double Gust N1';
const greatCatcher = 'Great Catcher CEC';
const omega = 'Primal Groudon-EX PRC';
const regirock = 'Regirock XYP';
const galvantula = 'Galvantula TEU';
const diancie = 'Diancie ASR';
const thievul = 'Thievul ASR 104';
const vmaxOrVstar = 'Arceus VSTAR BRS';
const poncho = 'Leafy Camo Poncho SIT';
const water = 'Water Energy SVE';
const mist = 'Mist Energy TEF';
const ordinary = 'Regigigas ASR';
const basic = 'Hoppip EVS';
const board = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0 };
let store: Store;

beforeAll(ensureClientCards);
afterEach(() => store?.cleanup());

function start(trainer: string, opposing: Partial<PlayerConfig>, own: Partial<PlayerConfig> = {}, format = Format.STANDARD) {
  const game = setupGame({
    turn: 5,
    player1: { active: { card: ordinary }, hand: [trainer], deck: padDeck(10), ...own },
    player2: { active: { card: ordinary }, deck: padDeck(10), ...opposing },
  });
  game.store.cleanup();
  const handler = { onStateChange: () => undefined, gameSettings: { format } };
  store = new Store(handler);
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

function cardNames(cards: { fullName: string }[]) { return cards.map(card => card.fullName); }

describe('Trainer switch targeting', () => {
  for (const trainer of [gust, catcher, 'Pokemon Reversal UF']) {
    for (const pokemon of [omega, regirock, basic]) {
      it(`${trainer} resolves against ${pokemon} and consumes the Item`, () => {
        const { player1, player2 } = start(trainer, { bench: [{ card: pokemon }] });
        const original = player2.active;
        const target = player2.bench[0];
        play();
        if (trainer !== gust) {
          expect(pending() instanceof CoinFlipPrompt).toBe(true);
          resolve(true);
        }
        chooseBench(PlayerType.TOP_PLAYER);
        expect(player2.active === (pokemon === basic ? target : original)).toBe(true);
        expect(cardNames(player1.discard.cards)).toEqual([trainer]);
        expect(pending()).toBeUndefined();
      });
    }
  }

  for (const format of [Format.BW, Format.STANDARD]) {
    it(`respects the Pokémon Catcher printing override in format ${format}`, () => {
      const { player2 } = start('Pokemon Catcher EPO', { bench: [{ card: omega }] }, {}, format);
      const original = player2.active;
      play();
      if (format === Format.STANDARD) resolve(true);
      chooseBench(PlayerType.TOP_PLAYER);
      expect(player2.active === original).toBe(true);
    });
  }

  it('discards Pokémon Catcher on tails without asking for a target', () => {
    const { player1, player2 } = start(catcher, { bench: [{ card: basic }] });
    const original = player2.active;
    play();
    resolve(false);
    expect(pending()).toBeUndefined();
    expect(player2.active === original).toBe(true);
    expect(cardNames(player1.discard.cards)).toEqual([catcher]);
  });

  it('Great Catcher pays two cards even if Ω Barrier prevents the switch', () => {
    const { player1, player2 } = start(greatCatcher, { bench: [{ card: omega }, { card: basic }] }, {
      hand: [greatCatcher, water, water],
    });
    const original = player2.active;
    play();
    expect(pending() instanceof ChooseCardsPrompt).toBe(true);
    resolve([0, 1]);
    const choose = pending() as ChoosePokemonPrompt;
    expect(choose.validate(choose.decode([{ player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 1 }], store.state), store.state)).toBe(false);
    chooseBench(PlayerType.TOP_PLAYER);
    expect(player2.active === original).toBe(true);
    expect(cardNames(player1.discard.cards).sort()).toEqual([greatCatcher, water, water].sort());
  });

  it('Great Catcher leaves the Item and its cost in hand when the choice is canceled', () => {
    const { player1 } = start(greatCatcher, { bench: [{ card: omega }] }, { hand: [greatCatcher, water, water] });
    play();
    resolve(null);
    expect(cardNames(player1.hand.cards).sort()).toEqual([greatCatcher, water, water].sort());
    expect(player1.discard.cards.length).toBe(0);
    expect(pending()).toBeUndefined();
  });

  it('Great Catcher counts a Prism Star cost when it goes to the Lost Zone', () => {
    const prism = 'Cyrus ◇ UPR';
    const { player1, player2 } = start(greatCatcher, { bench: [{ card: 'Dedenne GX UNB' }] }, {
      hand: [greatCatcher, prism, water],
    });
    const target = player2.bench[0];
    play();
    resolve([0, 1]);
    chooseBench(PlayerType.TOP_PLAYER);
    expect(player2.active === target).toBe(true);
    expect(cardNames(player1.discard.cards).sort()).toEqual([greatCatcher, water].sort());
    expect(cardNames(player1.lostzone.cards)).toEqual([prism]);
  });

  for (const trainer of [boss, lysandre, catcher]) {
    it(`${trainer} applies the correct part of Diancie’s Princess’s Curtain`, () => {
      const { player1, player2 } = start(trainer, { active: { card: diancie }, bench: [{ card: basic }] });
      const original = player2.active;
      const selected = player2.bench[0];
      play();
      if (trainer === catcher) resolve(true);
      chooseBench(PlayerType.TOP_PLAYER);
      expect(player2.active === (trainer === catcher ? selected : original)).toBe(true);
      expect(cardNames(player1.discard.cards)).toEqual([trainer]);
    });
  }

  for (const protector of [diancie, 'Rhyperior SCR']) {
    for (const suppressed of [false, true]) {
      it(`${protector} protects the Bench only when its Ability is active (${suppressed})`, () => {
        const { player2 } = start(boss, { active: { card: protector }, bench: [{ card: basic }] }, {
          active: { card: suppressed ? 'Flutter Mane TEF' : ordinary },
        });
        const active = player2.active;
        const target = player2.bench[0];
        play();
        chooseBench(PlayerType.TOP_PLAYER);
        expect(player2.active === (suppressed ? target : active)).toBe(true);
      });
    }
  }

  it('Vibrava prevents an opposing Supporter but can be switched with Pokémon Catcher', () => {
    const vibrava = 'Vibrava CEC';
    for (const trainer of [boss, catcher]) {
      const { player2 } = start(trainer, { bench: [{ card: vibrava }] });
      const original = player2.active;
      const target = player2.bench[0];
      play();
      if (trainer === catcher) resolve(true);
      chooseBench(PlayerType.TOP_PLAYER);
      expect(player2.active === (trainer === catcher ? target : original)).toBe(true);
      store.cleanup();
    }
  });

  it('Thievul protects a Benched Pokémon V from Supporters only at the printed Prize threshold', () => {
    for (const [trainer, prizes, blocked] of [[boss, 2, true], [boss, 3, false], [catcher, 2, false]] as const) {
      const { player2 } = start(trainer, { bench: [{ card: vmaxOrVstar }, { card: thievul }] }, { prizeCount: prizes });
      const original = player2.active;
      const target = player2.bench[0];
      play();
      if (trainer === catcher) resolve(true);
      chooseBench(PlayerType.TOP_PLAYER);
      expect(player2.active === (blocked ? original : target)).toBe(true);
      store.cleanup();
    }
  });

  for (const target of [galvantula, omega, basic]) {
    it(`Guzma switches its own Pokémon only after switching ${target}`, () => {
      const { player1, player2 } = start(guzma, { bench: [{ card: target }] }, { bench: [{ card: basic }] });
      const oldOwn = player1.active;
      const oldOpp = player2.active;
      play();
      chooseBench(PlayerType.TOP_PLAYER);
      if (target === basic) chooseBench(PlayerType.BOTTOM_PLAYER);
      expect(player1.active === oldOwn).toBe(target !== basic);
      expect(player2.active === oldOpp).toBe(target !== basic);
      expect(cardNames(player1.discard.cards)).toEqual([guzma]);
      expect(pending()).toBeUndefined();
    });
  }

  it('Guzma can switch with its own Bench empty and rejects a play with no opposing Bench', () => {
    let game = start(guzma, { bench: [{ card: basic }] });
    const target = game.player2.bench[0];
    play();
    chooseBench(PlayerType.TOP_PLAYER);
    expect(game.player2.active === target).toBe(true);
    expect(pending()).toBeUndefined();
    store.cleanup();
    game = start(guzma, {}, { bench: [{ card: basic }] });
    expect(() => play()).toThrow(new GameError(GameMessage.CANNOT_PLAY_THIS_CARD));
    expect(cardNames(game.player1.hand.cards)).toEqual([guzma]);
  });

  for (const tower of [true, false]) {
    it(`Serena checks the real Leafy Camo Poncho Tool slot${tower ? ' under Jamming Tower' : ''}`, () => {
      const { player1, player2 } = start(serena, { bench: [{ card: vmaxOrVstar, tools: [poncho] }, { card: basic }] });
      if (tower) player1.stadium.cards = [CardManager.getInstance().getCardByName('Jamming Tower TWM')!];
      const original = player2.active;
      const target = player2.bench[0];
      play();
      expect(pending() instanceof SelectPrompt).toBe(true);
      resolve(0);
      const choose = pending() as ChoosePokemonPrompt;
      const invalid = [{ player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 1 }];
      expect(choose.validate(choose.decode(invalid, store.state), store.state)).toBe(false);
      chooseBench(PlayerType.TOP_PLAYER);
      expect(player2.active === (tower ? target : original)).toBe(true);
      expect(pending()).toBeUndefined();
    });
  }

  it('Serena can discard when the deck is empty and rejects a play with neither mode available', () => {
    let game = start(serena, {}, { hand: [serena, water], deck: [] });
    play();
    expect(pending() instanceof SelectPrompt).toBe(true);
    resolve(0);
    expect(pending() instanceof ChooseCardsPrompt).toBe(true);
    expect((pending() as ChooseCardsPrompt).options.allowCancel).toBe(false);
    resolve([0]);
    expect(cardNames(game.player1.discard.cards).sort()).toEqual([serena, water].sort());
    store.cleanup();
    game = start(serena, {});
    expect(() => play()).toThrow(new GameError(GameMessage.CANNOT_PLAY_THIS_CARD));
    expect(cardNames(game.player1.hand.cards)).toEqual([serena]);
  });

  it('Serena recognizes a Benched Pokémon V-UNION', () => {
    const half = 'Pikachu V-UNION (Top Left) SWSH';
    const { player2 } = start(serena, { bench: [{ card: half }] });
    const target = player2.bench[0];
    ['Top Right', 'Bottom Left', 'Bottom Right'].forEach(part =>
      target.cards.push(CardManager.getInstance().getCardByName(`Pikachu V-UNION (${part}) SWSH`)!));
    play();
    resolve(0);
    chooseBench(PlayerType.TOP_PLAYER);
    expect(player2.active === target).toBe(true);
  });

  for (const hasProtectionOnActive of [true, false]) {
    it(`Ryme targets the old Active ${hasProtectionOnActive ? 'with' : 'without'} Ω Barrier`, () => {
      const { player1, player2 } = start(ryme, {
        active: { card: hasProtectionOnActive ? omega : ordinary },
        bench: [{ card: hasProtectionOnActive ? basic : omega }],
      });
      const original = player2.active;
      const replacement = player2.bench[0];
      play();
      expect(player1.hand.cards.length).toBe(3);
      if (!hasProtectionOnActive) {
        expect(pending()?.playerId).toBe(player2.id);
        chooseBench(PlayerType.BOTTOM_PLAYER);
      }
      expect(player2.active === (hasProtectionOnActive ? original : replacement)).toBe(true);
      expect(pending()).toBeUndefined();
    });
  }

  it('Ryme can draw alone and can switch alone', () => {
    let game = start(ryme, {});
    play();
    expect(game.player1.hand.cards.length).toBe(3);
    expect(pending()).toBeUndefined();
    store.cleanup();
    game = start(ryme, { bench: [{ card: basic }] }, { deck: [] });
    const replacement = game.player2.bench[0];
    play();
    chooseBench(PlayerType.BOTTOM_PLAYER);
    expect(game.player2.active === replacement).toBe(true);
    store.cleanup();
    game = start(ryme, {}, { deck: [] });
    expect(() => play()).toThrow(new GameError(GameMessage.CANNOT_PLAY_THIS_CARD));
    expect(cardNames(game.player1.hand.cards)).toEqual([ryme]);
  });

  it('Bewitching Eyes copies the draw from Ryme with Mist Energy on the old Active', () => {
    const { player1, player2 } = start(ryme, {
      active: { card: ordinary, energy: [mist] }, bench: [{ card: basic }], discard: [ryme],
    }, {
      active: { card: 'Sableye AOR', energy: ['Darkness Energy SVE'] }, hand: [],
    });
    const original = player2.active;
    store.dispatch(new AttackAction(player1.id, 'Bewitching Eyes'));
    resolve([0]);
    expect(player1.hand.cards.length).toBe(3);
    expect(player2.active === original).toBe(true);
    while (pending() instanceof WaitPrompt) resolve(true);
    expect(pending()).toBeUndefined();
    expect(store.state.turn).toBe(6);
    expect(cardNames(player2.discard.cards)).toEqual([ryme]);
  });

  for (const ownBench of [false, true]) {
    for (const enemyBench of [false, true]) {
      if (!ownBench && !enemyBench) continue;
      it(`Double Gust offers only the applicable mandatory switches (${ownBench}, ${enemyBench})`, () => {
        const { player1, player2 } = start(doubleGust, { bench: enemyBench ? [{ card: omega }] : [] }, {
          bench: ownBench ? [{ card: regirock }] : [],
        });
        const own = player1.active;
        const enemy = player2.active;
        play();
        if (ownBench) {
          const choose = pending() as ChoosePokemonPrompt;
          expect(choose.playerId).toBe(player2.id);
          expect(choose.options.min).toBe(1);
          chooseBench(PlayerType.TOP_PLAYER);
        }
        if (enemyBench) {
          const choose = pending() as ChoosePokemonPrompt;
          expect(choose.playerId).toBe(player1.id);
          expect(choose.options.min).toBe(1);
          chooseBench(PlayerType.TOP_PLAYER);
        }
        expect(player1.active === own).toBe(!ownBench);
        expect(player2.active === enemy).toBe(true);
        expect(pending()).toBeUndefined();
      });
    }
  }
});
