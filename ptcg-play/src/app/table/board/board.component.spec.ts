import { of } from 'rxjs';
import { CardList, EnergyCard, Player, PlayerType, PokemonCard, PokemonCardList, SlotType, Stage, State, TrainerCard } from 'ptcg-server';
import { BoardComponent } from './board.component';
import { HandCardType } from '../hand/hand-item.interface';

class Basic extends PokemonCard { name = 'Basic'; fullName = 'Basic TEST'; }
class Evolution extends PokemonCard { stage = Stage.STAGE_1; name = 'Evolution'; fullName = 'Evolution TEST'; }
class Energy extends EnergyCard { name = 'Energy'; fullName = 'Energy TEST'; }
class Trainer extends TrainerCard { name = 'Trainer'; fullName = 'Trainer TEST'; }

describe('responsive bench and drops', () => {
  let board: BoardComponent;
  let game: any;
  let targets: any[];
  let bounds: { width: number; height: number };
  let styles: { [key: string]: string };
  let cards: any;
  beforeEach(() => {
    bounds = { width: 390, height: 740 }; styles = {}; targets = [];
    game = jasmine.createSpyObj('game', ['playCardAction', 'retreatAction']);
    const dnd = {
      dragSource: () => ({ unsubscribe() {} }),
      dropTarget: (types: any, spec: any) => {
        const target = { spec, unsubscribe() {}, listen: () => of(false) };
        targets.push(target); return target;
      }
    };
    cards = jasmine.createSpyObj('cards', ['showCardInfo', 'showCardInfoList']);
    cards.showCardInfoList.and.returnValue(Promise.resolve(undefined));
    board = new BoardComponent(cards, dnd as any, game, { cardSize$: of(100) } as any, {} as any,
      { nativeElement: { getBoundingClientRect: () => bounds,
        style: { setProperty: (name: string, value: string) => styles[name] = value } } } as any,
      { run: (fn: () => void) => fn() } as any);
    board.bottomPlayer = new Player(); board.bottomPlayer.id = 10; board.clientId = 10;
    board.topPlayer = new Player(); board.topPlayer.id = 20;
    board.bottomPlayer.bench = Array.from({ length: 5 }, () => new PokemonCardList());
    board.topPlayer.bench = Array.from({ length: 8 }, () => new PokemonCardList());
    const state = new State(); state.players = [board.bottomPlayer, board.topPlayer]; state.activePlayer = 0;
    board.gameState = { gameId: 99, state } as any;
    board.ngOnChanges({});
  });
  afterEach(() => board.ngOnDestroy());

  function item(card = new Basic(), index = 3): any {
    card.id = 123; board.bottomPlayer.playableCardIds = [123];
    return { type: HandCardType, data: { card, index, scanUrl: '' } };
  }
  function monitor(drag: any, didDrop = false): any {
    return { getItem: () => drag, didDrop: () => didDrop };
  }
  function spec(target: any): any { return target.spec; }

  it('keeps opponent deck and prizes count-only even if their old handlers are called', () => {
    const prize = new CardList(); prize.cards = [new Basic()];
    board.topPlayer.prizes = [prize];
    board.topPlayer.deck.cards = [new Basic()];
    board.onDeckClick(undefined, board.topPlayer.deck);
    board.onPrizeClick(board.topPlayer, prize);
    board.onPrizesModalClick(board.topPlayer);
    expect(cards.showCardInfo).not.toHaveBeenCalled();
    expect(cards.showCardInfoList).not.toHaveBeenCalled();
  });

  it('preserves own deck and prize access and counts only occupied prize slots', () => {
    board.bottomPlayer.deck.cards = [new Basic()];
    const prize = new CardList(); prize.cards = [new Basic()];
    board.bottomPlayer.prizes = [prize, new CardList()];
    expect(board.getPrizeCount(board.bottomPlayer)).toBe(1);
    board.onDeckClick(undefined, board.bottomPlayer.deck);
    expect(cards.showCardInfoList).toHaveBeenCalledWith({ card: undefined, cardList: board.bottomPlayer.deck, facedown: false });
    board.onPrizesModalClick(board.bottomPlayer);
    expect(cards.showCardInfoList.calls.count()).toBe(2);
  });

  it('opens opponent discard for browsing without enabling actions from our discard', () => {
    const card = new Basic(); board.topPlayer.discard.cards = [card];
    board.onDiscardClick(card, board.topPlayer.discard);
    expect(cards.showCardInfoList).toHaveBeenCalledOnceWith({ card, cardList: board.topPlayer.discard });
  });

  it('browses either public Lost Zone and ignores empty piles', () => {
    for (const player of [board.topPlayer, board.bottomPlayer]) {
      board.onLostZoneClick(undefined, player.lostzone);
      expect(cards.showCardInfoList).not.toHaveBeenCalled();
    }
    for (const player of [board.topPlayer, board.bottomPlayer]) {
      const card = new Basic(); player.lostzone.cards = [card];
      board.onLostZoneClick(card, player.lostzone);
      expect(cards.showCardInfoList.calls.mostRecent().args).toEqual([{ card, cardList: player.lostzone }]);
    }
    expect(cards.showCardInfoList.calls.count()).toBe(2);
  });

  it('keeps the opponent in one row in tight frames and our bench in two rows', () => {
    board.bottomPlayer.bench.forEach(slot => slot.cards = [new Basic()]);
    board.topPlayer.bench.forEach(slot => slot.cards = [new Basic()]);
    board.ngOnChanges({});
    expect(board.isCompact).toBe(true);
    expect(board.benchColumns(board.bottomPlayer)).toBe(3);
    expect(board.benchColumns(board.topPlayer)).toBe(8);
    expect(board.benchRows(board.topPlayer)).toBe(1);
    expect(board.benchRows(board.bottomPlayer)).toBe(2);
    const phoneSize = parseFloat(styles['--bench-card-size']);
    expect(styles['--card-size']).toBe('60px');
    bounds = { width: 1280, height: 800 }; board.ngOnChanges({});
    expect(board.isCompact).toBe(false);
    expect(board.benchColumns(board.bottomPlayer)).toBe(5);
    expect(board.benchColumns(board.topPlayer)).toBe(8);
    expect(board.benchRows(board.topPlayer)).toBe(1);
    expect(parseFloat(styles['--bench-card-size'])).toBeGreaterThan(phoneSize);
    expect(styles['--card-size']).toBe('60px');
  });

  it('uses extra height for larger opponent cards without shrinking Active cards', () => {
    board.bottomPlayer.bench.forEach(slot => slot.cards = [new Basic()]);
    board.topPlayer.bench.forEach(slot => slot.cards = [new Basic()]);
    board.ngOnChanges({});
    const shortOpponent = parseFloat(styles['--opponent-bench-card-size']);
    bounds = { width: 430, height: 828 }; board.ngOnChanges({});
    expect(board.benchColumns(board.topPlayer)).toBe(4);
    expect(board.benchRows(board.topPlayer)).toBe(2);
    expect(parseFloat(styles['--opponent-bench-card-size'])).toBeGreaterThan(shortOpponent + 10);
    expect(parseFloat(styles['--bench-card-size'])).toBeGreaterThanOrEqual(64);
    expect(parseFloat(styles['--bench-card-size'])).toBeLessThanOrEqual(69);
    expect(styles['--card-size']).toBe('60px');
    board.isHandHidden = true; board.ngOnChanges({});
    expect(styles['--hand-space']).toBe('12px');
  });

  it('reserves both bench rows so filling slots cannot move the board', () => {
    bounds.height = 844; board.ngOnChanges({});
    const fieldHeight = styles['--top-field-height'];
    const ownSize = styles['--bench-card-size'];
    board.topPlayer.bench[0].cards = [new Basic()];
    board.topPlayer.bench[7].cards = [new Basic()];
    board.ngOnChanges({});
    expect(board.benchRows(board.topPlayer)).toBe(2);
    expect(board.benchColumns(board.topPlayer)).toBe(4);
    for (const index of [1, 2, 3]) board.topPlayer.bench[index].cards = [new Basic()];
    board.ngOnChanges({});
    expect(board.benchRows(board.topPlayer)).toBe(2);
    expect(styles['--top-field-height']).toBe(fieldHeight);
    expect(styles['--bench-card-size']).toBe(ownSize);
  });

  it('keeps the player boundary near the middle and unchanged across 5/8-slot capacity changes', () => {
    bounds = { width: 402, height: 743 };
    board.ngOnChanges({});
    const fieldHeight = styles['--top-field-height'];
    const ownSize = styles['--bench-card-size'];
    const fieldsHeight = bounds.height - 4 - parseFloat(styles['--hand-space']) - parseFloat(styles['--board-gap']);
    expect(parseFloat(fieldHeight) / fieldsHeight).toBeGreaterThan(0.43);
    expect(parseFloat(fieldHeight) / fieldsHeight).toBeLessThanOrEqual(0.5);
    for (const [top, bottom] of [[5, 5], [5, 8], [8, 8]]) {
      board.topPlayer.bench = Array.from({ length: top }, () => new PokemonCardList());
      board.bottomPlayer.bench = Array.from({ length: bottom }, () => new PokemonCardList());
      board.ngOnChanges({});
      expect(styles['--top-field-height']).toBe(fieldHeight);
      expect(styles['--bench-card-size']).toBe(ownSize);
    }
    board.gameState.state.prompts = [{ result: undefined }] as any;
    board.ngOnChanges({});
    expect(styles['--top-field-height']).toBe(fieldHeight);
  });

  it('fits full benches on a short phone while preserving a larger hand rail', () => {
    bounds = { width: 320, height: 568 };
    board.bottomPlayer.bench = Array.from({ length: 8 }, () => new PokemonCardList());
    board.bottomPlayer.bench.forEach(slot => slot.cards = [new Basic()]);
    board.topPlayer.bench.forEach(slot => slot.cards = [new Basic()]);
    board.ngOnChanges({});
    expect(parseFloat(styles['--bench-card-size'])).toBeGreaterThanOrEqual(46.5);
    expect(parseFloat(styles['--hand-space'])).toBeGreaterThan(115);
    expect(styles['--player-gap']).toBe('4px');
    expect(styles['--card-size']).toBe('60px');
  });

  it('never makes opponent bench cards larger than ours on phones, landscape or desktop', () => {
    for (const [width, height] of [[320, 464], [320, 568], [402, 743], [430, 828], [844, 390], [1280, 800]]) {
      bounds = { width, height };
      for (const capacity of [5, 8]) {
        board.topPlayer.bench = Array.from({ length: capacity }, () => new PokemonCardList());
        board.ngOnChanges({});
        expect(parseFloat(styles['--opponent-bench-card-size'])).toBeLessThanOrEqual(parseFloat(styles['--bench-card-size']));
      }
    }
  });

  it('keeps the opponent size cap correct when the board is reversed', () => {
    board.topPlayer.hand.cards = [new Basic(), new Basic()];
    board.bottomPlayer.hand.cards = [new Basic()];
    board.isUpsideDown = true;
    board.clientId = board.topPlayer.id;
    board.ngOnChanges({});
    expect(parseFloat(styles['--bench-card-size'])).toBeLessThanOrEqual(parseFloat(styles['--opponent-bench-card-size']));
  });

  it('falls back to one bench row in an exceptionally short embedded phone frame', () => {
    bounds = { width: 320, height: 464 };
    board.bottomPlayer.bench = Array.from({ length: 8 }, () => new PokemonCardList());
    board.bottomPlayer.bench.forEach(slot => slot.cards = [new Basic()]);
    board.topPlayer.bench.forEach(slot => slot.cards = [new Basic()]);
    board.ngOnChanges({});
    expect(board.benchColumns(board.bottomPlayer)).toBe(8);
    expect(board.benchRows(board.bottomPlayer)).toBe(1);
    expect(styles['--card-size']).toBe('60px');
    bounds.height = 740; board.ngOnChanges({});
    expect(board.benchColumns(board.bottomPlayer)).toBe(4);
    expect(board.benchRows(board.bottomPlayer)).toBe(2);
  });

  it('keeps two SE bench rows and gives the compact Active height back to the hand', () => {
    bounds = { width: 375, height: 537 };
    board.bottomPlayer.bench = Array.from({ length: 8 }, () => new PokemonCardList());
    board.ngOnChanges({});
    expect(board.benchRows(board.bottomPlayer)).toBe(2);
    expect(parseFloat(styles['--bench-card-size'])).toBeGreaterThan(39);
    expect(styles['--active-card-size']).toBe('72px');
    expect(parseFloat(styles['--hand-space'])).toBeGreaterThan(115);
    expect(styles['--card-size']).toBe('60px');
    const boundary = styles['--top-field-height'];
    board.topPlayer.bench = Array.from({ length: 5 }, () => new PokemonCardList());
    board.ngOnChanges({});
    expect(styles['--top-field-height']).toBe(boundary);
  });

  it('drops a Basic onto the first empty slot, including holes before occupied slots', () => {
    board.bottomPlayer.bench[0].cards = [new Basic()];
    board.bottomPlayer.bench[2].cards = [new Basic()];
    const drag = monitor(item());
    expect(spec(board.benchTarget).canDrop(drag)).toBe(true);
    spec(board.benchTarget).drop(drag);
    expect(game.playCardAction).toHaveBeenCalledOnceWith(99, 3,
      { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 1 });
  });

  it('uses the same first empty slot when dropping a Basic directly onto an occupied or later empty slot', () => {
    board.bottomPlayer.bench[0].cards = [new Basic()];
    const drag = monitor(item());
    for (const index of [0, 4]) {
      spec(board.bottomBenchTarget[index]).drop(drag);
      expect(game.playCardAction.calls.mostRecent().args[2].index).toBe(1);
    }
    spec(board.benchTarget).drop(monitor(drag.getItem(), true));
    expect(game.playCardAction.calls.count()).toBe(2);
  });

  it('keeps evolution, Energy and Tool/Trainer drops on their exact Pokemon target', () => {
    for (const card of [new Evolution(), new Energy(), new Trainer()]) {
      const drag = monitor(item(card));
      expect(spec(board.benchTarget).canDrop(drag)).toBe(false);
      spec(board.bottomBenchTarget[2]).drop(drag);
      expect(game.playCardAction.calls.mostRecent().args[2]).toEqual(
        { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 2 });
    }
  });

  it('rejects a full bench, unplayable cards, spectators, prompts, ended games and the opponent turn', () => {
    const drag = monitor(item());
    const available = () => spec(board.benchTarget).canDrop(drag);
    board.bottomPlayer.playableCardIds = []; expect(available()).toBe(false);
    board.bottomPlayer.playableCardIds = [123];
    board.clientId = 20; expect(available()).toBe(false); board.clientId = 10;
    board.gameState.promptMinimized = true; expect(available()).toBe(false); board.gameState.promptMinimized = false;
    board.gameState.state.prompts = [{ result: undefined }] as any; expect(available()).toBe(false); board.gameState.state.prompts = [];
    board.gameState.turnComplete = true; expect(available()).toBe(false); board.gameState.turnComplete = false;
    board.gameState.deleted = true; expect(available()).toBe(false); board.gameState.deleted = false;
    board.gameState.state.activePlayer = 1; expect(available()).toBe(false); board.gameState.state.activePlayer = 0;
    board.bottomPlayer.bench.forEach(slot => slot.cards = [new Basic()]);
    expect(available()).toBe(false);
    spec(board.benchTarget).drop(drag);
    spec(board.bottomBenchTarget[0]).drop(drag);
    expect(game.playCardAction).not.toHaveBeenCalled();
  });

  it('retains precise retreat targets when moving an existing Pokemon', () => {
    spec(board.bottomBenchTarget[3]).drop(monitor({ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 }));
    expect(game.retreatAction).toHaveBeenCalledWith(99, 3);
    spec(board.bottomActiveTarget).drop(monitor({ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 2 }));
    expect(game.retreatAction).toHaveBeenCalledWith(99, 2);
  });
});
