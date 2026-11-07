import { GameService } from '../../api/services/game.service';
import { SessionService } from '../session/session.service';
import { LocalGameState } from '../session/session.interface';
import { WebViewBridgeService } from './webview-bridge.service';

describe('PrizeMap reset bridge', () => {
  let service: WebViewBridgeService;
  let session: SessionService;
  let game: { resetGame: jasmine.Spy; pushStateChange: jasmine.Spy };
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
      pushStateChange: jasmine.createSpy('pushStateChange')
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
});
