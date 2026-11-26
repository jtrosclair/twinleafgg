import { Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { GameService } from '../../api/services/game.service';
import { PuzzleCatalogService } from '../../api/services/puzzle-catalog.service';
import { SessionService } from '../session/session.service';
import { LocalGameState } from '../session/session.interface';
import { WebViewBridgeService } from './webview-bridge.service';
import { SimulatorAssetsService } from './simulator-assets.service';

describe('PrizeMap reset bridge', () => {
  let service: WebViewBridgeService;
  let session: SessionService;
  let game: { resetGame: jasmine.Spy; pushStateChange: jasmine.Spy; setBoardReadOnly: jasmine.Spy;
    createGameFromState: jasmine.Spy; requestPuzzleHintState: jasmine.Spy; undoPuzzleHint: jasmine.Spy };
  let injector: { get: jasmine.Spy };
  let zone: { run: jasmine.Spy };
  let inZone: boolean;
  let resetZones: boolean[];
  let windowValue: any;
  let documentValue: any;
  let previousWindow: PropertyDescriptor | undefined;
  let previousDocument: PropertyDescriptor | undefined;

  const activeGame = (gameId: number, deleted = false) => ({ gameId, localId: gameId + 100, deleted } as LocalGameState);
  const message = (data: any) => new MessageEvent('message', { data, bubbles: true });

  beforeEach(() => {
    previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
    previousDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
    windowValue = new EventTarget();
    documentValue = new EventTarget();
    documentValue.documentElement = { setAttribute: jasmine.createSpy('setAttribute') };
    windowValue.parent = { postMessage: jasmine.createSpy('iframePostMessage') };
    windowValue.ReactNativeWebView = { postMessage: jasmine.createSpy('nativePostMessage') };
    windowValue.PrizeMapSimulator = { hostHook: 'preserved' };
    Object.defineProperty(globalThis, 'window', { configurable: true, value: windowValue });
    Object.defineProperty(globalThis, 'document', { configurable: true, value: documentValue });
    session = new SessionService();
    session.set({ gameStates: [activeGame(7)] });
    inZone = false; resetZones = [];
    game = {
      resetGame: jasmine.createSpy('resetGame').and.callFake(() => resetZones.push(inZone)),
      pushStateChange: jasmine.createSpy('pushStateChange'),
      setBoardReadOnly: jasmine.createSpy('setBoardReadOnly'),
      createGameFromState: jasmine.createSpy('createGameFromState'),
      requestPuzzleHintState: jasmine.createSpy('requestPuzzleHintState'),
      undoPuzzleHint: jasmine.createSpy('undoPuzzleHint')
    };
    injector = { get: jasmine.createSpy('get').and.returnValue(game) };
    zone = { run: jasmine.createSpy('run').and.callFake((run: () => any) => {
      inZone = true;
      try { return run(); } finally { inZone = false; }
    }) };
    spyOn(console, 'warn').and.stub();
    spyOn(console, 'error').and.stub();
    service = new WebViewBridgeService(injector as any, session, zone as any);
  });

  afterEach(() => {
    service.ngOnDestroy();
    if (previousWindow) { Object.defineProperty(globalThis, 'window', previousWindow); }
    else { delete (globalThis as any).window; }
    if (previousDocument) { Object.defineProperty(globalThis, 'document', previousDocument); }
    else { delete (globalThis as any).document; }
  });

  function expectNoResponse(): void {
    expect(windowValue.ReactNativeWebView?.postMessage).not.toHaveBeenCalled();
    expect(windowValue.parent.postMessage).not.toHaveBeenCalled();
  }

  it('accepts native window JSON resets with an object payload or omitted data', () => {
    windowValue.dispatchEvent(message(JSON.stringify({ type: 'ResetGame', data: {} })));
    windowValue.dispatchEvent(message(JSON.stringify({ type: 'ResetGame' })));
    expect(game.resetGame.calls.allArgs()).toEqual([[7], [7]]);
    expect(resetZones).toEqual([true, true]);
    expect(injector.get).toHaveBeenCalledWith(GameService);
    expect(injector.get.calls.count()).toBe(1);
    expectNoResponse();
  });

  it('accepts the alternative document message channel', () => {
    documentValue.dispatchEvent(message(JSON.stringify({ type: 'ResetGame', data: {} })));
    expect(game.resetGame).toHaveBeenCalledWith(7);
    expect(resetZones).toEqual([true]);
    expectNoResponse();
  });

  it('accepts object messages posted to the iframe window', () => {
    windowValue.dispatchEvent(message({ type: 'ResetGame', data: {} }));
    expect(game.resetGame).toHaveBeenCalledWith(7);
    expect(resetZones).toEqual([true]);
    expectNoResponse();
  });

  it('accepts an explicit board review request for the active game only', () => {
    windowValue.dispatchEvent(message({ type: 'SetBoardReadOnly', data: { readOnly: false } }));
    windowValue.dispatchEvent(message({ type: 'SetBoardReadOnly' }));
    expect(game.setBoardReadOnly).not.toHaveBeenCalled();
    documentValue.dispatchEvent(message(JSON.stringify({ type: 'SetBoardReadOnly', data: { readOnly: true } })));
    expect(game.setBoardReadOnly).toHaveBeenCalledOnceWith(7);
    session.clear();
    windowValue.dispatchEvent(message({ type: 'SetBoardReadOnly', data: { readOnly: true } }));
    expect(game.setBoardReadOnly).toHaveBeenCalledTimes(1);
    expectNoResponse();
  });

  it('exposes a direct reset function through the same zone and preserves the host namespace', () => {
    expect(windowValue.PrizeMapSimulator.hostHook).toBe('preserved');
    expect(window.PrizeMapSimulator!.reset()).toBeUndefined();
    window.PrizeMapSimulator!.reset();
    expect(game.resetGame.calls.allArgs()).toEqual([[7], [7]]);
    expect(zone.run.calls.count()).toBe(2);
    expect(resetZones).toEqual([true, true]);
    expectNoResponse();
  });

  it('does nothing before a game exists and does not instantiate the game service', () => {
    session.clear();
    window.PrizeMapSimulator!.reset();
    expect(game.resetGame).not.toHaveBeenCalled();
    expect(injector.get).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith('No active game found to reset');
    expectNoResponse();
  });

  it('uses the current session after replacement and skips deleted games', () => {
    window.PrizeMapSimulator!.reset();
    session.set({ gameStates: [activeGame(7, true), activeGame(9)] });
    documentValue.dispatchEvent(message({ type: 'ResetGame' }));
    session.set({ gameStates: [activeGame(12)] });
    window.PrizeMapSimulator!.reset();
    session.set({ gameStates: [activeGame(12, true)] });
    window.PrizeMapSimulator!.reset();
    expect(game.resetGame.calls.allArgs()).toEqual([[7], [9], [12]]);
    expectNoResponse();
  });

  it('ignores malformed reset packets and outbound iframe envelopes', () => {
    for (const data of [null, undefined, true, 0, [], 'not JSON', 'null', '"ResetGame"', '{}',
      { type: 42 }, { type: 'ResetGame', data: null }, { type: 'ResetGame', data: 'invalid' },
      { type: 'ResetGame', data: false }, { type: 'ResetGame', data: [] },
      { type: 'iframeEvent', data: { type: 'ResetGame', data: {} } }]) {
      windowValue.dispatchEvent(message(data));
    }
    expect(game.resetGame).not.toHaveBeenCalled();
    expect(injector.get).not.toHaveBeenCalled();
    expect(zone.run).not.toHaveBeenCalled();
    expectNoResponse();
  });

  it('handles one bubbling event once while allowing separate equal-payload events', () => {
    const data = JSON.stringify({ type: 'ResetGame', data: {} });
    const event = message(data);
    documentValue.dispatchEvent(event);
    windowValue.dispatchEvent(event);
    expect(game.resetGame.calls.count()).toBe(1);
    windowValue.dispatchEvent(message(data));
    expect(game.resetGame.calls.count()).toBe(2);
    expect(zone.run.calls.count()).toBe(2);
    expectNoResponse();
  });

  it('preserves incoming host undo dispatch and contains a rejected reset without a new response', () => {
    windowValue.dispatchEvent(message({ type: 'PushStateChange', data: { stateData: 'saved snapshot' } }));
    expect(game.pushStateChange).toHaveBeenCalledWith(7, 'saved snapshot');
    expect(game.resetGame).not.toHaveBeenCalled();
    game.resetGame.and.throwError('Stale game');
    expect(() => window.PrizeMapSimulator!.reset()).not.toThrow();
    expect(game.resetGame).toHaveBeenCalledWith(7);
    expectNoResponse();
  });

  function enableTaggedSession(activate = true, hints = false) {
    service.ngOnDestroy();
    windowValue.location = new URL(`http://127.0.0.1:45000/releases/${'a'.repeat(64)}/sandbox-viewer?puzzleBoardReview=1&puzzleSessionId=first`);
    if (hints) { windowValue.location.searchParams.set('puzzleHints', '1'); }
    const router = { navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true)) };
    const assets = { beginAttempt: jasmine.createSpy('beginAttempt') };
    const catalog = { prepareSnapshot: jasmine.createSpy('prepareSnapshot').and.callFake((stateData: string) => of(stateData)) };
    injector.get.and.callFake(token => token === Router ? router : token === SimulatorAssetsService ? assets
      : token === PuzzleCatalogService ? catalog : game);
    service = new WebViewBridgeService(injector as any, session, zone as any);
    if (activate) {
      service.initialPuzzleActivated(true);
      windowValue.ReactNativeWebView.postMessage.calls.reset();
    }
    return { router, assets, catalog, api: window.PrizeMapSimulator! };
  }

  const flush = () => new Promise(resolve => setTimeout(resolve, 0));
  const sent = () => windowValue.ReactNativeWebView.postMessage.calls.allArgs().map(([value]) => JSON.parse(value));

  it('keeps hint commands restricted to the parent on web iframe documents', () => {
    for (const type of ['RequestPuzzleHintState', 'UndoPuzzleHint']) {
      windowValue.dispatchEvent(message({ type, sessionId: 'spoofed' }));
    }
    expect(game.requestPuzzleHintState).not.toHaveBeenCalled();
    expect(game.undoPuzzleHint).not.toHaveBeenCalled();

    for (const type of ['RequestPuzzleHintState', 'UndoPuzzleHint']) {
      const event = message({ type });
      Object.defineProperty(event, 'source', { value: windowValue.parent });
      windowValue.dispatchEvent(event);
    }
    expect(game.requestPuzzleHintState).toHaveBeenCalledOnceWith(7);
    expect(game.undoPuzzleHint).toHaveBeenCalledOnceWith(7);
  });

  it('keeps hint capture and requires the active native session across a reused puzzle load', async () => {
    const { api } = enableTaggedSession(true, true);
    windowValue.parent = windowValue;
    windowValue.dispatchEvent(message({ type: 'RequestPuzzleHintState', sessionId: 'first' }));
    documentValue.dispatchEvent(message(JSON.stringify({ type: 'UndoPuzzleHint', sessionId: 'first' })));
    windowValue.dispatchEvent(message({ type: 'UndoPuzzleHint' }));
    expect(game.requestPuzzleHintState).toHaveBeenCalledOnceWith(7);
    expect(game.undoPuzzleHint).toHaveBeenCalledOnceWith(7);

    game.createGameFromState.and.callFake(() => {
      session.set({ gameStates: [activeGame(8)] });
      return of(activeGame(8));
    });
    api.loadPuzzle!({ stateData: 'new puzzle', sessionId: 'second' });
    windowValue.dispatchEvent(message({ type: 'RequestPuzzleHintState', sessionId: 'first' }));
    await flush();
    expect(game.createGameFromState).toHaveBeenCalledOnceWith('new puzzle', undefined,
      { stopAfterOpponentDraw: true, closeDialogs: true, capturePuzzleDecisions: true });

    for (const sessionId of ['first', 'second']) {
      windowValue.dispatchEvent(message({ type: 'RequestPuzzleHintState', sessionId }));
      documentValue.dispatchEvent(message({ type: 'UndoPuzzleHint', sessionId }));
    }
    expect(game.requestPuzzleHintState.calls.allArgs()).toEqual([[7], [8]]);
    expect(game.undoPuzzleHint.calls.allArgs()).toEqual([[7], [8]]);
  });

  it('acknowledges cold activation once and tags its initial state before the ACK', () => {
    enableTaggedSession(false);
    service.postMessage({ type: 'StateUpdate', data: { stateData: 'initial board' } });
    service.initialPuzzleActivated(true);
    service.initialPuzzleActivated(false);
    expect(sent()).toEqual([
      { type: 'StateUpdate', sessionId: 'first', data: { stateData: 'initial board' } },
      { type: 'PrizeMapPuzzleLoaded', sessionId: 'first', ok: true },
    ]);
  });

  it('switches the view in the same document, tags the new state and only acknowledges an activated board', async () => {
    const { api, router, assets } = enableTaggedSession();
    let finishTableNavigation: (ok: boolean) => void;
    const boardNavigation = new Promise<boolean>(resolve => { finishTableNavigation = resolve; });
    router.navigate.and.returnValues(Promise.resolve(true), boardNavigation);
    game.createGameFromState.and.callFake(() => {
      session.set({ gameStates: [activeGame(8)] });
      service.postMessage({ type: 'StateUpdate', data: { stateData: 'fresh canonical state' } });
      return of(activeGame(8));
    });
    service.postMessage({ type: 'StateUpdate', data: { stateData: 'first canonical state' } });
    api.loadPuzzle!({ stateData: 'snapshot for second puzzle', sessionId: 'second' });
    api.loadPuzzle!({ stateData: 'repeated second request', sessionId: 'second' });
    api.reset('first');
    await flush();
    expect(router.navigate.calls.allArgs()).toEqual([
      [['/sandbox-viewer'], { skipLocationChange: true }],
      [['/table', 108], { skipLocationChange: true }],
    ]);
    expect(assets.beginAttempt.calls.count()).toBe(1);
    expect(game.createGameFromState).toHaveBeenCalledWith('snapshot for second puzzle', undefined,
      { stopAfterOpponentDraw: true, closeDialogs: true });
    expect(game.createGameFromState.calls.count()).toBe(1);
    expect(sent()).toEqual([
      { type: 'StateUpdate', sessionId: 'first', data: { stateData: 'first canonical state' } },
      { type: 'StateUpdate', sessionId: 'second', data: { stateData: 'fresh canonical state' } },
    ]);
    finishTableNavigation(true);
    await flush();
    expect(sent()[2]).toEqual({ type: 'PrizeMapPuzzleLoaded', sessionId: 'second', ok: true });
    api.loadPuzzle!({ stateData: 'stale first request', sessionId: 'first' });
    api.reset('first');
    api.reset();
    api.reset('second');
    expect(game.resetGame.calls.allArgs()).toEqual([[8]]);

    documentValue.dispatchEvent(message({ type: 'PushStateChange', sessionId: 'first', data: { stateData: 'stale undo' } }));
    documentValue.dispatchEvent(message({ type: 'PushStateChange', sessionId: 'second', data: { stateData: 'current undo' } }));
    expect(game.pushStateChange.calls.allArgs()).toEqual([[8, 'current undo']]);
    windowValue.dispatchEvent(message({ type: 'SetBoardReadOnly', sessionId: 'first', data: { readOnly: true } }));
    windowValue.dispatchEvent(message({ type: 'SetBoardReadOnly', sessionId: 'second', data: { readOnly: true } }));
    expect(game.setBoardReadOnly.calls.allArgs()).toEqual([[8]]);
    expect(game.createGameFromState.calls.count()).toBe(1);
  });

  it('rejects a malformed switch without retagging the existing game', async () => {
    const { api } = enableTaggedSession();
    game.createGameFromState.and.returnValue(throwError(new Error('Invalid snapshot')));
    api.loadPuzzle!({ stateData: 'malformed snapshot', sessionId: 'invalid' });
    await flush();
    service.postMessage({ type: 'StateUpdate', data: { stateData: 'still the first game' } });
    expect(sent()).toEqual([
      { type: 'PrizeMapPuzzleLoaded', sessionId: 'invalid', ok: false, error: 'Could not open the new puzzle' },
      { type: 'StateUpdate', sessionId: 'first', data: { stateData: 'still the first game' } },
    ]);
  });

  it('leaves the current board mounted when loading the next snapshot catalog fails', async () => {
    const { api, catalog, router } = enableTaggedSession();
    const pending = new Subject<string>();
    catalog.prepareSnapshot.and.returnValue(pending);
    api.loadPuzzle!({ stateData: 'second snapshot', sessionId: 'second' });
    api.reset('first');
    expect(router.navigate).not.toHaveBeenCalled();
    expect(game.resetGame).not.toHaveBeenCalled();
    pending.error(new Error('Missing rule chunk'));
    await flush();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(game.createGameFromState).not.toHaveBeenCalled();
    expect(sent()).toEqual([
      { type: 'PrizeMapPuzzleLoaded', sessionId: 'second', ok: false, error: 'Could not open the new puzzle' },
    ]);
    api.reset('first');
    expect(game.resetGame).toHaveBeenCalledOnceWith(7);
  });

  it('does not activate or acknowledge a pending replacement after the document is destroyed', async () => {
    const { api, router } = enableTaggedSession();
    let finishNavigation: (ok: boolean) => void;
    router.navigate.and.returnValue(new Promise<boolean>(resolve => { finishNavigation = resolve; }));
    api.loadPuzzle!({ stateData: 'Second', sessionId: 'second' });
    service.ngOnDestroy();
    finishNavigation(true);
    await flush();
    expect(game.createGameFromState).not.toHaveBeenCalled();
    expectNoResponse();
  });
});
