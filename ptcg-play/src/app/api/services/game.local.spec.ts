import { of } from 'rxjs';
import { Base64, CardList, CardManager, CardType, ChoosePokemonPrompt, ConfirmPrompt, DiscardEnergyPrompt,
  EnergyCard, GameMessage, GamePhase, GameWinner, Player, PlayerType, PokemonCard, PokemonCardList,
  PowerType, SlotType, State, StateSerializer, StoreLike } from 'ptcg-server';
// Use the same compiled effect classes as the runner's browser-engine alias.
import { Effect } from '../../../../../ptcg-server/browser/game/store/effects/effect';
import { PowerEffect } from '../../../../../ptcg-server/browser/game/store/effects/game-effects';
import { SessionService } from '../../shared/session/session.service';
import { GameService } from './game.service';
import { TableComponent } from '../../table/table.component';
import { PromptComponent } from '../../table/prompt/prompt.component';
import { PromptDiscardEnergyComponent } from '../../table/prompt/prompt-discard-energy/prompt-discard-energy.component';
import { BoardComponent, pileLayerIndices } from '../../table/board/board.component';
import { BoardInteractionService } from '../../shared/services/board-interaction.service';
import { HandComponent } from '../../table/hand/hand.component';
import { PromptChoosePokemonComponent } from '../../table/prompt/prompt-choose-pokemon/prompt-choose-pokemon.component';
import { encodePuzzleFieldCodes } from '../../shared/services/puzzle-field-codes';

class AdapterPokemon extends PokemonCard {
  name = 'Adapter Pokemon';
  fullName = 'Adapter Pokemon TEST';
  set = 'TEST';
  hp = 100;
  powers = [{ name: 'Reset prompt', powerType: PowerType.ABILITY, useWhenInPlay: true, text: '' }];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      return store.prompt(state, new ConfirmPrompt(effect.player.id, GameMessage.WANT_TO_USE_ABILITY), accepted => {
        if (accepted) { effect.player.marker.addMarker('Reset prompt resolved', this); }
      });
    }
    return state;
  }
}

class AdapterEnergy extends EnergyCard {
  name = 'Adapter Energy'; fullName = 'Adapter Energy TEST'; set = 'TEST'; provides = [CardType.FIRE];
}

describe('visual board pile layers', () => {
  it('renders empty and small piles exactly and preserves full depth for large piles', () => {
    expect(pileLayerIndices(0)).toEqual([]);
    expect(pileLayerIndices(1)).toEqual([0]);
    expect(pileLayerIndices(2)).toEqual([0, 1]);
    expect(pileLayerIndices(3)).toEqual([0, 1, 2]);
    expect(pileLayerIndices(30)).toEqual([0, 14, 29]);
    expect(pileLayerIndices(38)).toEqual([0, 18, 37]);
    expect(pileLayerIndices(120).map(index => index * 0.25)).toEqual([0, 14.75, 29.75]);
  });

  it('opens complete physical piles and uses the selected discard card physical index for actions', async () => {
    const board: any = Object.create(BoardComponent.prototype);
    const pile = new CardList();
    pile.cards = Array.from({ length: 38 }, (_, index) => {
      const card = new AdapterPokemon(); card.id = 800 + index * 17; return card;
    });
    const originalCards = pile.cards.slice(), capturedCard = pile.cards[27];
    board.clientId = 43;
    board.bottomPlayer = { id: 43 };
    board.topPlayer = { id: 42 };
    board.gameState = { deleted: false, gameId: 911 };
    board.cardsBaseService = jasmine.createSpyObj('cards', ['showCardInfoList']);
    board.cardsBaseService.showCardInfoList.and.returnValue(Promise.resolve(undefined));
    board.gameService = jasmine.createSpyObj('game', ['ability']);
    board.onDeckClick(capturedCard, pile);
    expect(board.cardsBaseService.showCardInfoList.calls.mostRecent().args[0].cardList).toBe(pile);
    board.cardsBaseService.showCardInfoList.and.returnValue(Promise.resolve({ card: capturedCard, ability: 'Recovered power' }));
    board.onDiscardClick(pile.cards[37], pile);
    await Promise.resolve();
    expect(board.cardsBaseService.showCardInfoList.calls.mostRecent().args[0].cardList).toBe(pile);
    expect(board.gameService.ability).toHaveBeenCalledWith(911, 'Recovered power', {
      player: PlayerType.BOTTOM_PLAYER, slot: SlotType.DISCARD, index: 27
    });
    expect(pile.cards.length).toBe(38);
    expect(pile.cards.every((card, index) => card === originalCards[index])).toBe(true);
    expect(pile.cards[27].id).toBe(1259);
  });
});

describe('client-side snapshot GameService', () => {
  let service: GameService;
  let session: SessionService;
  let network: jasmine.Spy;
  let bridge: any;
  let board: BoardInteractionService;
  let dialog: any;
  let snapshot: string;
  let previousKnownCards: any[];
  let previousManagerCards: any[];

  beforeEach(() => {
    previousKnownCards = StateSerializer.knownCards;
    previousManagerCards = CardManager.getInstance().getAllCards();
    const card = new AdapterPokemon();
    StateSerializer.setKnownCards([card]);
    CardManager.getInstance().loadCardsInfo({ cards: [card], hash: 'test' });
    const state = new State();
    state.phase = GamePhase.PLAYER_TURN;
    state.turn = 3;
    let cardId = 0;
    const createCard = () => {
      const copy = new AdapterPokemon();
      copy.id = cardId++;
      state.cardNames.push(copy.fullName);
      return copy;
    };
    state.players = [43, 42].map((id, index) => {
      const player = new Player();
      player.id = id;
      player.name = 'Player ' + (index + 1);
      player.active.cards = [createCard()];
      player.bench = Array.from({ length: 5 }, () => new PokemonCardList());
      player.hand.cards = [createCard(), createCard()];
      player.deck.cards = [createCard(), createCard(), createCard()];
      player.prizes = Array.from({ length: 2 }, () => {
        const prize = new CardList();
        prize.cards = [createCard()];
        return prize;
      });
      return player;
    });
    snapshot = new Base64().encode(new StateSerializer().serialize(state));
    session = new SessionService();
    network = spyOn(globalThis, 'fetch').and.callFake(() => { throw new Error('Gameplay cannot request the network'); });
    bridge = jasmine.createSpyObj('bridge', ['postMessage']);
    board = new BoardInteractionService();
    spyOn(board, 'endBoardSelection').and.callThrough();
    spyOn(board, 'updateGameLogs').and.callThrough();
    dialog = jasmine.createSpyObj('dialog', ['closeAll']);
    service = new GameService(
      jasmine.createSpyObj('alert', ['toast']), session,
      { currentLang: 'en', translations: { en: { GAME_MESSAGES: {} } }, instant: (key: string) => key } as any,
      board, { run: (fn: () => any) => fn() } as any, bridge, dialog);
  });

  afterEach(() => {
    StateSerializer.setKnownCards(previousKnownCards);
    CardManager.getInstance().loadCardsInfo({ cards: previousManagerCards, hash: '' });
  });

  function load(): number {
    let gameId: number;
    service.createGameFromState(snapshot).subscribe(game => gameId = game.gameId);
    return gameId;
  }

  function createTable(): TableComponent {
    const localId = session.session.gameStates[0].localId;
    const table = new TableComponent(service,
      { paramMap: of({ get: () => String(localId) }) } as any,
      jasmine.createSpyObj('router', ['navigate']), session,
      jasmine.createSpyObj('board', ['endBoardSelection']));
    table.ngOnInit();
    return table;
  }

  function messages(type: string): any[] {
    return bridge.postMessage.calls.allArgs().map(args => args[0]).filter(message => message.type === type);
  }

  function expectNoTransport(): void {
    expect(network).not.toHaveBeenCalled();
  }

  function gzipPayload(stateData: string, version: 'gz1' | 'gz2' = 'gz1'): string {
    const json = new Base64().decode(stateData);
    const compressed = require('node:zlib').gzipSync(Buffer.from(
      version === 'gz2' ? encodePuzzleFieldCodes(json) : json, 'utf8'));
    return version + '.' + compressed.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  it('loads and plays a turn without a login or game transport', () => {
    const gameId = load();
    expect('authToken' in session.session).toBe(false);
    expect('users' in session.session).toBe(false);
    expect(session.session.gameStates[0].clientSide).toBe(true);
    expect(messages('StateUpdate').length).toBe(1);
    service.reorderHandAction(gameId, [1, 0]);
    service.passTurnAction(gameId);
    service.passTurnAction(gameId); // A completed turn rejects further actions locally.
    expect(messages('TurnEnd').length).toBe(1);
    expect(session.session.gameStates[0].turnComplete).toBe(true);
    expect(JSON.parse(new Base64().decode(messages('StateUpdate')[2].data.stateData))[1].turnComplete).toBeUndefined();
    expect(messages('StateUpdate').length).toBe(3);
    expectNoTransport();
  });

  it('publishes the initial isolated snapshot without repeating its state roundtrip', () => {
    const serialize = spyOn(StateSerializer.prototype, 'serialize').and.callThrough();
    const deserialize = spyOn(StateSerializer.prototype, 'deserialize').and.callThrough();
    let returned: any;
    service.createGameFromState(snapshot).subscribe(game => returned = game);
    const game = session.session.gameStates[0];
    expect(serialize.calls.count()).toBe(1);
    // Runtime hydration and the isolated presentation state each need one decode.
    expect(deserialize.calls.count()).toBe(2);
    expect(game.state).toBe(returned.state);
    expect(game.state).not.toBe((service as any).simulator.state);
    expect(messages('StateUpdate').length).toBe(1);
    expect(messages('StateUpdate')[0].data.stateData).toBe(game.stateData);
    expect(game.state.players.map(player => player.id)).toEqual([43, 42]);
    service.passTurnAction(game.gameId);
    expect(messages('TurnEnd').length).toBe(1);
    expect(returned.state.turn).toBe(3);
    expectNoTransport();
  });

  it('loads gzip transport synchronously while keeping host updates, undo and reset in exact plain Base64', () => {
    const parsed = JSON.parse(new Base64().decode(snapshot));
    parsed[0][0].name = 'Pokémon 🃏';
    const plain = new Base64().encode(JSON.stringify(parsed));
    const compressed = gzipPayload(plain);
    const winConditions = { selfDeckOut: true, mustLose: false, cardsInDeck: 17 };
    let plainLoaded = false;
    service.createGameFromState(plain, winConditions).subscribe(() => plainLoaded = true);
    expect(plainLoaded).toBe(true);
    const baseline = session.session.gameStates[0].stateData;
    let validated = false;
    service.validateGameState(compressed).subscribe(result => validated = result.ok && result.valid);
    expect(validated).toBe(true);
    let gameId: number;
    service.createGameFromState(compressed, winConditions).subscribe(game => gameId = game.gameId);
    expect(gameId!).toBeDefined();
    expect(session.session.gameStates[0].stateData).toBe(baseline);
    expect(session.session.gameStates[0].state.players[0].name).toBe('Pokémon 🃏');
    expect(session.session.gameStates[0].state.players.map(player => player.id)).toEqual([43, 42]);
    service.reorderHandAction(gameId!, [1, 0]);
    service.pushStateChange(gameId!, baseline);
    expect(session.session.gameStates[0].stateData).toBe(baseline);
    service.passTurnAction(gameId!);
    service.resetGame(gameId!);
    expect(session.session.gameStates[0].gameId).toBe(gameId!);
    expect(session.session.gameStates[0].stateData).toBe(baseline);
    expect(session.session.gameStates[0].state.winConditions).toEqual(winConditions);
    expect(messages('UndoDetected').length).toBe(2);
    expect(messages('TurnEnd').length).toBe(1);
    for (const update of messages('StateUpdate')) {
      expect(update.data.stateData.startsWith('gz1.')).toBe(false);
      expect(Array.isArray(JSON.parse(new Base64().decode(update.data.stateData))[1].prompts)).toBe(true);
    }
    expectNoTransport();
  });

  it('loads field-coded gzip with exact legacy host history and preserves marker references and unknown fields', () => {
    const state = new StateSerializer().deserialize(new Base64().decode(snapshot));
    state.players[0].name = 'Pokémon 🃏 a ~name';
    const markerName = 'a ~name 星';
    state.players[0].marker.addMarker(markerName, state.players[0].active.getPokemonCard()!);
    state.players[0].marker.addMarker(markerName + ' copied', state.players[0].active.getPokemonCard()!);
    const winConditions: any = {
      selfDeckOut: true, mustLose: false, cardsInDeck: 17,
      customRule: { a: 'name', '~name': 'a', nested: [{ '~': '勝利' }] }
    };
    state.winConditions = winConditions;
    const fullJson = new StateSerializer().serialize(state);
    expect(JSON.parse(fullJson)[0][0].marker.markers[1].source)
      .toEqual({ _type: 'Ref', path: '0.0.marker.markers.0.source' });
    const plain = new Base64().encode(fullJson);
    service.createGameFromState(plain).subscribe();
    const baseline = session.session.gameStates[0].stateData;
    let history: string[] = [];
    bridge.postMessage.and.callFake(message => {
      if (message.type !== 'StateUpdate') { return; }
      const data = message.data.stateData;
      const rawState = JSON.parse(new Base64().decode(data))[1];
      if (rawState.prompts.length === 0 && !history.includes(data)) { history.push(data); }
    });
    let validated = false, gameId: number;
    const compressed = gzipPayload(plain, 'gz2');
    service.validateGameState(compressed).subscribe(result => validated = result.ok && result.valid);
    expect(validated).toBe(true);
    service.createGameFromState(compressed).subscribe(game => gameId = game.gameId);
    expect(gameId!).toBeDefined();
    expect(history).toEqual([baseline]);
    const player = session.session.gameStates[0].state.players[0];
    expect(player.name).toBe('Pokémon 🃏 a ~name');
    expect(player.marker.hasMarker(markerName, player.active.getPokemonCard()!)).toBe(true);
    expect(player.marker.hasMarker(markerName + ' copied', player.active.getPokemonCard()!)).toBe(true);
    expect(session.session.gameStates[0].state.winConditions).toEqual(winConditions);
    service.playCardAction(gameId!, 0, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 });
    expect(history.length).toBe(2);
    history = history.slice(0, -1);
    service.pushStateChange(gameId!, history[0]);
    expect(history).toEqual([baseline]);
    service.passTurnAction(gameId!);
    history = [];
    service.resetGame(gameId!);
    service.resetGame(gameId!);
    expect(history).toEqual([baseline]);
    expect(session.session.gameStates[0].stateData).toBe(baseline);
    const restored = session.session.gameStates[0].state.players[0];
    expect(restored.marker.hasMarker(markerName, restored.active.getPokemonCard()!)).toBe(true);
    expect(session.session.gameStates[0].state.winConditions).toEqual(winConditions);
    expect(messages('StateUpdate').every(update => !/^gz\d+\./.test(update.data.stateData))).toBe(true);
    expectNoTransport();
  });

  it('rejects invalid compressed replacements without changing the current selection, game or reset baseline', () => {
    const gameId = load();
    const baseline = session.session.gameStates[0].stateData;
    service.reorderHandAction(gameId, [1, 0]);
    const progressed = session.session.gameStates[0].stateData;
    const target = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
    board.startBoardSelection(new ChoosePokemonPrompt(43, GameMessage.CHOOSE_POKEMON,
      PlayerType.BOTTOM_PLAYER, [SlotType.ACTIVE]), jasmine.createSpy('pending selection'));
    board.toggleTarget(target);
    const updateCount = messages('StateUpdate').length;
    const unescapedField = gzipPayload(new Base64().encode('[[],{"notAFieldCode":1}]')).replace(/^gz1\./, 'gz2.');
    const escapedKnownField = gzipPayload(new Base64().encode('[[],{"~name":1}]')).replace(/^gz1\./, 'gz2.');
    for (const invalid of ['gz1.AA', 'gz2.AA', 'gz3.AA', unescapedField, escapedKnownField,
      gzipPayload(new Base64().encode('{}')), gzipPayload(new Base64().encode('[[],{}]'), 'gz2')]) {
      let rejected = false;
      service.createGameFromState(invalid).subscribe({
        next: () => fail('An invalid compressed puzzle must not replace the active game'),
        error: () => rejected = true
      });
      expect(rejected).toBe(true);
      let validation: any;
      service.validateGameState(invalid).subscribe(result => validation = result);
      expect(validation.ok).toBe(false);
      expect(validation.valid).toBe(false);
      expect(session.session.gameStates[0].gameId).toBe(gameId);
      expect(session.session.gameStates[0].stateData).toBe(progressed);
      expect(board.isSelectionActive()).toBe(true);
      expect(board.isTargetSelected(target)).toBe(true);
      expect(messages('StateUpdate').length).toBe(updateCount);
    }
    service.resetGame(gameId);
    expect(session.session.gameStates[0].stateData).toBe(baseline);
    expect(board.isSelectionActive()).toBe(false);
    expectNoTransport();
  });

  it('publishes compact snapshots that preserve raw host headers and exact-string undo/reset history', () => {
    let history: string[] = [];
    bridge.postMessage.and.callFake(message => {
      if (message.type !== 'StateUpdate') { return; }
      const data = message.data.stateData;
      // PrizeMap's native and web hosts parse this header without engine hydration.
      const state = JSON.parse(new Base64().decode(data))[1];
      if ((!state.prompts || state.prompts.length === 0) && !history.includes(data)) { history.push(data); }
    });
    const fullInput = JSON.parse(new Base64().decode(snapshot));
    expect(fullInput[0][0].avatarName).toBe('');
    let gameId: number;
    service.createGameFromState(snapshot, { selfDeckOut: true, mustLose: false, cardsInDeck: 17 })
      .subscribe(game => gameId = game.gameId);
    const initial = history[0];
    const [players, state] = JSON.parse(new Base64().decode(initial));
    expect(initial.length).toBeLessThan(snapshot.length);
    expect(players.map(player => player.id)).toEqual([43, 42]);
    expect(players.map(player => player.name)).toEqual(['Player 1', 'Player 2']);
    expect(players[0].avatarName).toBeUndefined();
    for (const player of players) {
      for (const zone of ['deck', 'hand', 'discard', 'lostzone', 'stadium', 'supporter', 'active']) {
        expect(Array.isArray(player[zone].cards)).toBe(true);
      }
      expect(player.bench.length).toBe(5);
      expect(player.bench.every(list => Array.isArray(list.cards))).toBe(true);
      expect(player.prizes.length).toBe(2);
    }
    expect(state._type).toBe('State');
    expect(state.phase).toBe(GamePhase.PLAYER_TURN);
    expect(state.turn).toBe(3);
    expect(state.activePlayer).toBe(0);
    expect(state.winner).toBe(GameWinner.NONE);
    expect(state.prompts).toEqual([]);
    expect(state.logs).toEqual([]);
    expect(state.cardNames).toEqual(fullInput[1].cardNames);
    expect(state.winConditions).toEqual({ selfDeckOut: true, mustLose: false, cardsInDeck: 17 });
    expect(state.gameSettings.timeLimit).toBe(0);
    expect(state.gameSettings.recordingEnabled).toBe(false);
    expect(state.gameSettings.sandboxMode).toBe(true);
    const ownBench = (index: number) => ({ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index });
    service.playCardAction(gameId, 0, ownBench(0));
    service.playCardAction(gameId, 0, ownBench(1));
    expect(history.length).toBe(3);
    for (let count = 2; count >= 1; count--) {
      const previous = history[history.length - 2];
      history = history.slice(0, -1);
      service.pushStateChange(gameId, previous);
      // A byte-different re-encoding would create a new host undo entry here.
      expect(history.length).toBe(count);
      expect(session.session.gameStates[0].stateData).toBe(previous);
    }
    expect(session.session.gameStates[0].stateData).toBe(initial);
    service.playCardAction(gameId, 0, ownBench(0));
    history = []; // A host explicitly starts a fresh undo history on reset.
    service.resetGame(gameId);
    service.resetGame(gameId);
    expect(history).toEqual([initial]);
    expect(session.session.gameStates[0].stateData).toBe(initial);
    expect(session.session.gameStates[0].state.players[0].avatarName).toBe('');
    expect(messages('UndoDetected').length).toBe(4);
    service.canUndo(gameId).subscribe(canUndo => expect(canUndo).toBe(false));
    expectNoTransport();
  });

  it('still publishes one result when an imported snapshot is already finished', () => {
    const parsed = JSON.parse(new Base64().decode(snapshot));
    parsed[1].phase = GamePhase.FINISHED;
    parsed[1].winner = GameWinner.PLAYER_1;
    const finished = new Base64().encode(JSON.stringify(parsed));
    service.createGameFromState(finished).subscribe();
    expect(messages('StateUpdate').length).toBe(1);
    expect(messages('GameOver')).toEqual([{ type: 'GameOver', data: { winner: 'player1' } }]);
    expect(session.session.gameStates[0].turnComplete).toBe(true);
    expect(session.session.gameStates[0].state.players.map(player => player.id)).toEqual([43, 42]);
    expectNoTransport();
  });

  it('rewinds from PrizeMap history and can finish the turn again', () => {
    const gameId = load();
    const initialStateData = messages('StateUpdate')[0].data.stateData;
    service.passTurnAction(gameId);
    service.pushStateChange(gameId, initialStateData);
    expect(messages('UndoDetected').length).toBe(1);
    expect(session.session.gameStates[0].state.turn).toBe(3);
    expect(session.session.gameStates[0].turnComplete).toBe(false);
    service.passTurnAction(gameId);
    expect(messages('TurnEnd').length).toBe(2);
    expectNoTransport();
  });

  it('resets to the exact initial published snapshot after multiple actions and host restoration', () => {
    const winConditions = { selfDeckOut: true, mustLose: false, cardsInDeck: 17 };
    let gameId: number;
    service.createGameFromState(snapshot, winConditions).subscribe(game => gameId = game.gameId);
    const initial = session.session.gameStates[0];
    const baseline = messages('StateUpdate')[0].data.stateData;
    const originalOrder = initial.state.players.map(player => ({
      id: player.id, hand: player.hand.cards.map(card => card.id), deck: player.deck.cards.map(card => card.id)
    }));
    service.reorderHandAction(gameId, [1, 0]);
    service.playCardAction(gameId, 0, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 });
    expect(session.session.gameStates[0].state.players[0].hand.cards.length).toBe(1);
    service.canUndo(gameId).subscribe(canUndo => expect(canUndo).toBe(true));
    const progressed = session.session.gameStates[0].stateData;
    // Caller-owned options cannot mutate the reset baseline or runtime restores.
    winConditions.mustLose = true;
    service.pushStateChange(gameId, progressed);
    service.passTurnAction(gameId);
    expect(session.session.gameStates[0].turnComplete).toBe(true);
    bridge.postMessage.calls.reset();
    service.resetGame(gameId);
    expect(bridge.postMessage.calls.allArgs().map(args => args[0].type)).toEqual(['UndoDetected', 'StateUpdate']);
    const reset = session.session.gameStates[0];
    expect(reset.stateData).toBe(baseline);
    expect(reset.gameId).toBe(initial.gameId);
    expect(reset.localId).toBe(initial.localId);
    expect(reset.state.players.map(player => ({
      id: player.id, hand: player.hand.cards.map(card => card.id), deck: player.deck.cards.map(card => card.id)
    }))).toEqual(originalOrder);
    expect(reset.state.winConditions).toEqual({ selfDeckOut: true, mustLose: false, cardsInDeck: 17 });
    expect(reset.turnComplete).toBe(false);
    service.canUndo(gameId).subscribe(canUndo => expect(canUndo).toBe(false));
    expectNoTransport();
  });

  it('clears pending continuations, selection, minimized prompts and dialogs before publishing reset', () => {
    const gameId = load();
    const initial = session.session.gameStates[0];
    service.ability(gameId, 'Reset prompt', { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 });
    const pending = session.session.gameStates[0].state.prompts.find(prompt => prompt.result === undefined)!;
    expect(pending.type).toBe('Confirm');
    const staleSelection = jasmine.createSpy('stale selection');
    const target = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
    board.startBoardSelection(new ChoosePokemonPrompt(43, GameMessage.CHOOSE_POKEMON,
      PlayerType.BOTTOM_PLAYER, [SlotType.ACTIVE]), staleSelection);
    board.toggleTarget(target);
    expect(board.isSelectionActive()).toBe(true);
    service.setPromptMinimized(initial.localId, true);
    const order: string[] = [];
    dialog.closeAll.and.callFake(() => order.push('closeDialogs'));
    bridge.postMessage.and.callFake(message => order.push(message.type));
    service.resetGame(gameId);
    expect(order).toEqual(['closeDialogs', 'UndoDetected', 'StateUpdate']);
    expect(dialog.closeAll.calls.count()).toBe(1);
    expect(board.isSelectionActive()).toBe(false);
    expect(board.isTargetSelected(target)).toBe(false);
    board.confirmSelection();
    expect(staleSelection).not.toHaveBeenCalled();
    expect(session.session.gameStates[0].promptMinimized).toBe(false);
    expect(session.session.gameStates[0].stateData).toBe(initial.stateData);
    expect(session.session.gameStates[0].state.prompts).toEqual([]);
    const updates = messages('StateUpdate').length;
    service.resolvePrompt(gameId, pending.id, true);
    expect(messages('StateUpdate').length).toBe(updates);
    expect(session.session.gameStates[0].state.players[0].marker.hasMarker('Reset prompt resolved')).toBe(false);
    service.canUndo(gameId).subscribe(canUndo => expect(canUndo).toBe(false));
    expectNoTransport();
  });

  it('resets to the settled initial update when an imported opponent turn was automatically passed', () => {
    const imported = new StateSerializer().deserialize(new Base64().decode(snapshot));
    imported.activePlayer = 1;
    const importedData = new Base64().encode(new StateSerializer().serialize(imported));
    let gameId: number;
    service.createGameFromState(importedData).subscribe(game => gameId = game.gameId);
    const baseline = messages('StateUpdate')[0].data.stateData;
    const initial = session.session.gameStates[0].state;
    expect(initial.activePlayer).toBe(0);
    expect(initial.turn).toBeGreaterThan(imported.turn);
    service.reorderHandAction(gameId, initial.players[0].hand.cards.map((_, index, cards) => cards.length - 1 - index));
    service.resetGame(gameId);
    expect(session.session.gameStates[0].stateData).toBe(baseline);
    expect(session.session.gameStates[0].stateData).not.toBe(importedData);
    expect(session.session.gameStates[0].state.turn).toBe(initial.turn);
    expectNoTransport();
  });

  it('resets repeatedly after turn end and game over while allowing each fresh attempt to report its result', () => {
    const gameId = load();
    const baseline = session.session.gameStates[0].stateData;
    service.passTurnAction(gameId);
    expect(messages('TurnEnd').length).toBe(1);
    service.resetGame(gameId);
    service.resetGame(gameId);
    expect(messages('UndoDetected').length).toBe(2);
    expect(session.session.gameStates[0].stateData).toBe(baseline);
    service.passTurnAction(gameId);
    expect(messages('TurnEnd').length).toBe(2);
    const finished = new StateSerializer().deserialize(new Base64().decode(baseline));
    finished.phase = GamePhase.FINISHED;
    finished.winner = GameWinner.PLAYER_1;
    const finishedData = new Base64().encode(new StateSerializer().serialize(finished));
    service.pushStateChange(gameId, finishedData);
    expect(messages('GameOver').length).toBe(1);
    service.resetGame(gameId);
    expect(session.session.gameStates[0].stateData).toBe(baseline);
    expect(session.session.gameStates[0].turnComplete).toBe(false);
    service.pushStateChange(gameId, finishedData);
    expect(messages('GameOver').length).toBe(2);
    expectNoTransport();
  });

  it('replaces the reset baseline only when a new puzzle loads successfully and rejects stale reset IDs', () => {
    const firstId = load();
    const next = new StateSerializer().deserialize(new Base64().decode(snapshot));
    next.turn = 9;
    next.players[0].id = 81;
    next.players[1].id = 63;
    next.players[0].deck.cards.reverse();
    next.players[0].hand.cards.reverse();
    const nextData = new Base64().encode(new StateSerializer().serialize(next));
    let secondId: number;
    service.createGameFromState(nextData).subscribe(game => secondId = game.gameId);
    const secondBaseline = session.session.gameStates[0].stateData;
    const updates = messages('StateUpdate').length;
    service.resetGame(firstId);
    expect(messages('StateUpdate').length).toBe(updates);
    expect(dialog.closeAll).not.toHaveBeenCalled();
    service.passTurnAction(secondId);
    service.resetGame(secondId);
    expect(session.session.gameStates[0].stateData).toBe(secondBaseline);
    expect(session.session.gameStates[0].state.players.map(player => player.id)).toEqual([81, 63]);
    expect(session.session.gameStates[0].state.turn).toBe(9);
    service.removeGameState(secondId);
    const removedUpdates = messages('StateUpdate').length;
    service.resetGame(secondId);
    expect(session.session.gameStates).toEqual([]);
    expect(messages('StateUpdate').length).toBe(removedUpdates);
    expectNoTransport();
  });

  it('preserves a playable puzzle and its reset baseline when a replacement snapshot is invalid', () => {
    const gameId = load();
    const baseline = session.session.gameStates[0].stateData;
    service.reorderHandAction(gameId, [1, 0]);
    const progressed = session.session.gameStates[0].stateData;
    let rejected = false;
    service.createGameFromState('invalid').subscribe({
      next: () => fail('An invalid snapshot must not replace the active game'),
      error: () => rejected = true
    });
    expect(rejected).toBe(true);
    expect(session.session.gameStates[0].gameId).toBe(gameId);
    expect(session.session.gameStates[0].stateData).toBe(progressed);
    service.resetGame(gameId);
    expect(session.session.gameStates[0].stateData).toBe(baseline);
    expectNoTransport();
  });

  it('rewinds a completed turn with the local toolbar undo', () => {
    const gameId = load();
    service.passTurnAction(gameId);
    service.canUndo(gameId).subscribe(canUndo => expect(canUndo).toBe(true));
    service.undo(gameId);
    expect(messages('UndoDetected').length).toBe(1);
    expect(session.session.gameStates[0].state.turn).toBe(3);
    expect(session.session.gameStates[0].turnComplete).toBe(false);
    service.passTurnAction(gameId);
    expect(messages('TurnEnd').length).toBe(2);
    expectNoTransport();
  });

  it('keeps native terminal reporting without a local result prompt and still shows unresolved human prompts', () => {
    const gameId = load();
    service.passTurnAction(gameId);
    const game = session.session.gameStates[0];
    const table = new TableComponent(service, {} as any,
      jasmine.createSpyObj('router', ['navigate']), session,
      jasmine.createSpyObj('board', ['endBoardSelection']));
    table.gameState = game;
    (table as any).updatePlayers(game, session.session.clientId);
    expect(table.waiting).toBe(false);
    expect(messages('TurnEnd').length).toBe(1);
    const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
    Object.defineProperty(globalThis, 'window', { configurable: true, value: { setTimeout: (callback: () => void) => callback() } });
    try {
      const promptComponent = new PromptComponent(service, { detectChanges: () => {} } as any);
      promptComponent.clientId = session.session.clientId;
      promptComponent.gameState = game;
      promptComponent.ngOnChanges({ gameState: { previousValue: undefined } } as any);
      expect(promptComponent.prompt).toBeUndefined();
      expect(promptComponent.isPromptVisible).toBe(false);
      const pending = { id: 91, playerId: session.session.clientId, type: 'Confirm', result: undefined } as any;
      promptComponent.gameState = { ...game, turnComplete: false, state: { ...game.state, prompts: [pending] } } as any;
      promptComponent.ngOnChanges({ gameState: { previousValue: game } } as any);
      expect(promptComponent.prompt).toBe(pending);
      expect(promptComponent.isPromptVisible).toBe(true);
      expect(messages('TurnEnd').length).toBe(1);
    } finally {
      if (previousWindow) { Object.defineProperty(globalThis, 'window', previousWindow); }
      else { delete (globalThis as any).window; }
    }
    expect(game.state.phase).toBe(GamePhase.PLAYER_TURN);
    expect(game.state.activePlayer).toBe(1);
    expectNoTransport();
  });

  it('rejects callbacks for replaced, removed, and cleared sessions without server fallback', () => {
    const firstId = load();
    const secondId = load();
    service.passTurnAction(firstId);
    expect(session.session.gameStates[0].turnComplete).toBe(false);
    service.removeGameState(secondId);
    service.passTurnAction(secondId);
    const thirdId = load();
    session.clear();
    service.passTurnAction(thirdId);
    service.canUndo(thirdId).subscribe(() => fail('The cleared game is unavailable'), () => {});
    const fourthId = load();
    expect(fourthId).toBeGreaterThan(thirdId);
    service.passTurnAction(thirdId);
    expect(session.session.gameStates[0].turnComplete).toBe(false);
    expectNoTransport();
  });

  it('ends a turn and supports repeated toolbar undo using the runtime game ID', () => {
    load();
    session.clear();
    const gameId = load();
    const table = createTable();
    expect(gameId).not.toBe(table.gameState.localId);
    expect(table.canEndTurn()).toBe(true);
    expect(table.canUndoBackend).toBe(false);
    service.reorderHandAction(gameId, [1, 0]);
    expect(table.canUndoBackend).toBe(true);
    table.endTurn();
    expect(table.gameState.turnComplete).toBe(true);
    expect(table.canEndTurn()).toBe(false);
    expect(table.canUndoBackend).toBe(true);
    table.undo();
    expect(table.gameState.turnComplete).toBe(false);
    expect(table.canUndoBackend).toBe(true);
    table.undo();
    expect(table.canUndoBackend).toBe(false);
    expect(table.canEndTurn()).toBe(true);
    expect(messages('UndoDetected').length).toBe(2);
    table.ngOnDestroy();
    expectNoTransport();
  });

  it('blocks turn and undo controls while a prompt is awaiting an answer', () => {
    const gameId = load();
    const table = createTable();
    service.reorderHandAction(gameId, [1, 0]);
    const previousUpdates = messages('StateUpdate').length;
    table.gameState.state.prompts = [{ result: undefined, playerId: session.session.clientId } as any];
    expect(table.canEndTurn()).toBe(false);
    table.endTurn();
    table.undo();
    expect(messages('StateUpdate').length).toBe(previousUpdates);
    expect(table.canUndoBackend).toBe(true);
    table.gameState.state.prompts = [];
    table.gameState.state.phase = GamePhase.ATTACK;
    expect(table.canEndTurn()).toBe(false);
    table.gameState.state.phase = GamePhase.PLAYER_TURN;
    table.gameState.state.activePlayer = 1;
    expect(table.canEndTurn()).toBe(false);
    table.ngOnDestroy();
    expectNoTransport();
  });

  it('confirms a discard-energy selection synchronously using the engine prompt contract', () => {
    load();
    const game = session.session.gameStates[0];
    const energy = new AdapterEnergy();
    game.state.players[0].active.cards.push(energy);
    game.state.players[0].active.energies.cards.push(energy);
    const prompt = new DiscardEnergyPrompt(43, GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      PlayerType.BOTTOM_PLAYER, [SlotType.ACTIVE], {}, { min: 1, max: 1 });
    prompt.id = 7;
    const actions = jasmine.createSpyObj('game', ['resolvePrompt']);
    const component = new PromptDiscardEnergyComponent(actions,
      { getScanUrl: () => 'data:image/png;base64,AA==' } as any);
    component.prompt = prompt;
    component.gameState = game;
    const polling = spyOn(globalThis, 'setInterval').and.callThrough();
    component.ngOnInit();
    const pokemon = component.pokemonItems.find(item => item.playerType === PlayerType.BOTTOM_PLAYER && item.slot === SlotType.ACTIVE)!;
    component.selectedEnergies = [{ card: energy, pokemon, originalIndex: 1 }];
    component.confirm();
    expect(polling).not.toHaveBeenCalled();
    expect(component.isConfirming).toBe(false);
    expect(actions.resolvePrompt.calls.count()).toBe(1);
    const [gameId, promptId, result] = actions.resolvePrompt.calls.mostRecent().args;
    expect(gameId).toBe(game.gameId);
    expect(promptId).toBe(7);
    expect(prompt.validate(prompt.decode(result, game.state))).toBe(true);
    expectNoTransport();
  });

  it('validates and replaces the sole game locally', () => {
    const firstId = load();
    service.validateGameState(snapshot).subscribe(result => expect(result.valid).toBe(true));
    service.validateGameState('invalid').subscribe(result => expect(result.valid).toBe(false));
    const secondId = load();
    expect(secondId).not.toBe(firstId);
    expect(session.session.gameStates.length).toBe(1);
    expect(session.session.gameStates[0].gameId).toBe(secondId);
    expectNoTransport();
  });

  it('uses the bundled Holon\'s Castform icon when discarding its attached energy', () => {
    const component = new PromptDiscardEnergyComponent({} as any, {} as any);
    const energy = new AdapterEnergy();
    energy.name = 'Holon\'s Castform';
    expect(component.getCustomEnergyImageUrl(energy)).toBe('assets/energy/holons-castform.webp');
    expectNoTransport();
  });

  it('unlocks the hand after Turo returns active Gholdengo and a new active is chosen in the published Dengo puzzle', () => {
    const fs = require('node:fs'), zlib = require('node:zlib'), path = require('node:path');
    const fixture = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.resolve(__dirname,
      '../../../../../tools/fixtures/deck-out-with-dengo.snapshot.json.gz'))).toString('utf8'));
    const sets = require('../../../../../ptcg-server/browser/sets');
    const cards = Object.values(sets).filter(Array.isArray).reduce((all: any[], set: any[]) => all.concat(set), []);
    CardManager.getInstance().loadCardsInfo({ cards, hash: 'published-puzzle-test' });
    StateSerializer.setKnownCards(cards);
    const previousDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
    Object.defineProperty(globalThis, 'document', { configurable: true, value: { querySelector: () => null } });
    const hand = new HandComponent({ getScanUrl: () => '' } as any, service);
    const updates = session.get(value => value.gameStates).subscribe(games => {
      if (!games[0]) { return; }
      hand.gameState = games[0];
      hand.clientId = session.session.clientId;
      hand.player = games[0].state.players[0];
      hand.ngOnChanges();
    });
    const canDragNestBall = () => hand.handSpec.canDrag!(hand.list.find(item => item.card.id === 6)!, hand.handListId, {} as any);
    const chooseOnBoard = (target: { player: PlayerType; slot: SlotType; index: number }) => {
      const game = session.session.gameStates[0];
      const prompt = game.state.prompts.find(item => item.type === 'Choose pokemon' && item.result === undefined)!;
      const component = new PromptChoosePokemonComponent(service, board);
      component.gameState = game;
      component.prompt = prompt as ChoosePokemonPrompt;
      component.ngOnChanges();
      expect(session.session.gameStates[0].promptMinimized).toBe(true);
      expect(canDragNestBall()).toBe(false);
      // A harmless publication clones the prompt, but it is still the same
      // outstanding choice and must retain the board-selection drag lock.
      const before = session.session.gameStates[0];
      service.reorderHandAction(game.gameId, before.state.players[0].hand.cards.map((_, index) => index));
      const samePrompt = session.session.gameStates[0].state.prompts.find(item => item.result === undefined)!;
      expect(samePrompt).not.toBe(prompt);
      expect(samePrompt.id).toBe(prompt.id);
      expect(samePrompt.type).toBe(prompt.type);
      expect(session.session.gameStates[0].promptMinimized).toBe(true);
      expect(canDragNestBall()).toBe(false);
      board.toggleTarget(target);
      board.confirmSelection();
    };
    try {
      let gameId: number;
      service.createGameFromState(fixture.stateData).subscribe(game => gameId = game.gameId);
      const initial = session.session.gameStates[0].state.players[0];
      const promotedCardId = initial.bench[0].getPokemonCard()!.id;
      expect(initial.active.getPokemonCard()!.name).toBe('Gholdengo ex');
      expect(canDragNestBall()).toBe(true);
      service.playCardAction(gameId, initial.hand.cards.findIndex(card => card.id === 7),
        { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0 });
      chooseOnBoard({ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 });
      const promotion = session.session.gameStates[0].state.prompts.find(prompt => prompt.result === undefined)!;
      expect(promotion.message).toBe(GameMessage.CHOOSE_NEW_ACTIVE_POKEMON);
      expect(promotion.id).toBe(2);
      expect(session.session.gameStates[0].promptMinimized).toBe(false);
      chooseOnBoard({ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 });
      const resumed = session.session.gameStates[0];
      expect(resumed.state.prompts.filter(prompt => prompt.result === undefined)).toEqual([]);
      expect(resumed.state.players[0].active.getPokemonCard()!.id).toBe(promotedCardId);
      expect(resumed.promptMinimized).toBe(false);
      expect(canDragNestBall()).toBe(true);
      service.playCardAction(gameId, resumed.state.players[0].hand.cards.findIndex(card => card.id === 6),
        { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0 });
      const search = session.session.gameStates[0].state.prompts.find(prompt => prompt.result === undefined)!;
      expect(search.type).toBe('Choose cards');
      expect(search.id).toBe(1); // A new prompt may reuse Turo's ID with a different type.
      expect(session.session.gameStates[0].promptMinimized).toBe(false);
      service.resolvePrompt(gameId, search.id, [(search as any).cards.cards.findIndex(card => card.id === 1)]);
      expect(session.session.gameStates[0].state.players[0].bench.some(list => list.cards.some(card => card.id === 1))).toBe(true);
      expect(session.session.gameStates[0].turnComplete).toBe(false);
      expect(messages('TurnEnd').length).toBe(0);
      expect(messages('GameOver').length).toBe(0);
      expectNoTransport();
    } finally {
      updates.unsubscribe();
      if (previousDocument) { Object.defineProperty(globalThis, 'document', previousDocument); }
      else { delete (globalThis as any).document; }
    }
  });
});
