import { of, throwError } from 'rxjs';
import { StateSerializer } from 'ptcg-server';
import { SandboxViewerComponent } from './sandbox-viewer.component';

describe('SandboxViewer lazy artwork startup', () => {
  const snapshot = 'SNAPSHOT';
  let documentValue: Document;
  let attributes: { [name: string]: string };
  let clockMs: number;
  let frames: FrameRequestCallback[];
  let components: SandboxViewerComponent[];
  let originals: Map<string, PropertyDescriptor | undefined>;

  function replaceGlobal(name: string, value: any): void {
    originals.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { configurable: true, value });
  }

  beforeEach(() => {
    clockMs = 1000; attributes = {}; frames = []; components = []; originals = new Map();
    documentValue = {
      location: new URL('https://sim-static.prizemap.app/sandbox-viewer#' + snapshot),
      baseURI: `https://sim-static.prizemap.app/releases/${'a'.repeat(64)}/`,
      documentElement: { setAttribute: (name: string, value: string) => attributes[name] = value }
    } as any;
    replaceGlobal('document', documentValue);
    replaceGlobal('performance', { now: () => clockMs });
    replaceGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => { frames.push(callback); return frames.length; });
    spyOn(console, 'error').and.stub();
  });

  afterEach(() => {
    components.forEach(component => component.ngOnDestroy());
    originals.forEach((descriptor, name) => {
      if (descriptor) { Object.defineProperty(globalThis, name, descriptor); }
      else { delete (globalThis as any)[name]; }
    });
  });

  function create() {
    const order: string[] = [];
    const assets = { beginAttempt: jasmine.createSpy('beginAttempt').and.callFake(() => order.push('attempt')) };
    const game = { createGameFromState: jasmine.createSpy('createGameFromState').and.callFake(() => {
      order.push('game'); return of({ gameId: 29 });
    }) };
    const cards = jasmine.createSpyObj('cards', ['getRawScanUrl', 'getScanUrl', 'getCards', 'getCardNames', 'loadCardsInfo']);
    const metadata = { getCardsInfo: jasmine.createSpy('getCardsInfo').and.returnValue(of({})) };
    const router = { navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true)) };
    const component = new SandboxViewerComponent({ snapshot: {} } as any, router as any,
      { session: { gameStates: [{ gameId: 29, localId: 17 }] } } as any,
      { instant: (key: string) => key } as any, metadata as any,
      cards as any, game as any, assets as any, documentValue);
    const initialInput = component.stateDataInput;
    component.stateDataInput = '  ' + snapshot + '  ';
    component.isReady = true;
    components.push(component);
    return { component, assets, game, cards, metadata, router, order, initialInput };
  }

  const timing = () => JSON.parse(attributes['data-simulator-setup']);
  async function flush(): Promise<void> { await Promise.resolve(); await Promise.resolve(); }
  function paintFrames(): void {
    while (frames.length) {
      const current = frames.splice(0); clockMs += 16;
      current.forEach(callback => callback(clockMs));
    }
  }

  it('starts with an empty manual entry and can clear pasted state without a shipped demo', () => {
    const value = create();
    expect(value.initialInput).toBe('');
    value.component.clearInput();
    value.component.loadGameState();
    expect(value.component.error).toBe('SANDBOX_VIEWER_EMPTY_INPUT');
    expect(value.game.createGameFromState).not.toHaveBeenCalled();
  });

  it('keeps metadata errors visible and can retry corrected bundled metadata before loading a puzzle', () => {
    const previousCards = StateSerializer.knownCards;
    StateSerializer.setKnownCards([]);
    try {
      const value = create();
      value.component.isReady = false;
      value.metadata.getCardsInfo.and.returnValue(throwError(new Error('Reload this page to update the simulator.')));
      value.component.ngOnInit();
      expect(value.component.isReady).toBe(false);
      expect(value.component.initializingSession).toBe(false);
      expect(value.component.error).toContain('Reload this page');
      expect(value.cards.loadCardsInfo).not.toHaveBeenCalled();
      expect(value.game.createGameFromState).not.toHaveBeenCalled();
      value.metadata.getCardsInfo.and.returnValue(of({}));
      value.component.retryConnection();
      expect(value.component.isReady).toBe(true);
      expect(value.component.error).toBe('');
      expect(value.cards.loadCardsInfo).toHaveBeenCalledTimes(1);
    } finally { StateSerializer.setKnownCards(previousCards); }
  });

  it('starts the attempt and game immediately without enumerating or preloading artwork', async () => {
    const value = create();
    value.component.loadGameState();
    expect(value.assets.beginAttempt).toHaveBeenCalledWith();
    expect(value.order).toEqual(['attempt', 'game']);
    expect(value.game.createGameFromState).toHaveBeenCalledWith(snapshot);
    expect(value.router.navigate).toHaveBeenCalledWith(['/table', 17], { skipLocationChange: true });
    expect(value.cards.getRawScanUrl).not.toHaveBeenCalled();
    expect(value.cards.getScanUrl).not.toHaveBeenCalled();
    expect(value.cards.getCards).not.toHaveBeenCalled();
    expect(value.cards.getCardNames).not.toHaveBeenCalled();
    value.component.loadGameState();
    expect(value.game.createGameFromState.calls.count()).toBe(1);
    expect(value.assets.beginAttempt.calls.count()).toBe(1);
    await flush(); paintFrames();
    expect(timing().stages.engineReady).toBeDefined();
    expect(timing().stages.boardPainted).toBeDefined();
    expect(timing().stages.artworkStart).toBeUndefined();
    expect(timing().stages.artworkSettled).toBeUndefined();
  });

  it('handles a missing bundled UI before creating a game', () => {
    const value = create();
    const message = 'The simulator presentation payload did not finish downloading.';
    value.assets.beginAttempt.and.throwError(message);
    value.component.loadGameState();
    expect(value.component.loading).toBe(false);
    expect(value.component.error).toBe(message);
    expect(value.game.createGameFromState).not.toHaveBeenCalled();
    expect(value.router.navigate).not.toHaveBeenCalled();
  });

  it('reports engine validation errors without requesting artwork or routing to a table', () => {
    const value = create();
    value.game.createGameFromState.and.returnValue(throwError(new Error('Invalid game state')));
    value.component.loadGameState();
    expect(value.assets.beginAttempt.calls.count()).toBe(1);
    expect(value.component.loading).toBe(false);
    expect(value.component.error).toBe('Invalid game state');
    expect(value.cards.getRawScanUrl).not.toHaveBeenCalled();
    expect(value.router.navigate).not.toHaveBeenCalled();
  });

  it('keeps an older routed viewer frame from replacing the newer attempt paint time', async () => {
    const older = create();
    older.component.loadGameState(); await flush();
    const oldFrame = frames.shift()!;
    older.component.ngOnDestroy();
    const newer = create();
    newer.component.loadGameState(); await flush(); paintFrames();
    const latestTiming = timing();
    expect(latestTiming.stages.boardPainted).toBeDefined();
    newer.component.ngOnDestroy();
    clockMs += 1000;
    oldFrame(clockMs); paintFrames();
    expect(timing()).toEqual(latestTiming);
    expect(older.game.createGameFromState.calls.count()).toBe(1);
    expect(newer.game.createGameFromState.calls.count()).toBe(1);
  });
});
