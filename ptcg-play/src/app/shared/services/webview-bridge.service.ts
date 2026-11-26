import { Injectable, NgZone, Injector, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../api/services/game.service';
import { PuzzleCatalogService } from '../../api/services/puzzle-catalog.service';
import { SessionService } from '../session/session.service';
import { SimulatorAssetsService } from './simulator-assets.service';
import { beginPuzzleSetup, markPuzzleSetup } from './puzzle-setup-timing';

export interface WebViewMessage {
  type: string;
  data?: any;
  sessionId?: string;
  ok?: boolean;
  error?: string;
}

export interface PuzzleLoadRequest {
  stateData: string;
  sessionId: string;
}

export interface PrizeMapSimulatorApi {
  reset(sessionId?: string): void;
  loadPuzzle?(request: PuzzleLoadRequest): void;
}

declare global {
  interface Window {
    PrizeMapSimulator?: PrizeMapSimulatorApi;
    ReactNativeWebView?: { postMessage(data: string): void };
  }
}

const SESSION_ID = /^[A-Za-z0-9_-]{1,96}$/;

// The persistent native host opts in on a verified loopback document. Keep
// the published simulator and existing untagged app builds on their old API.
export function nativePuzzleSessionId(window: Window | null): string | undefined {
  const location = window?.location;
  if (!window?.ReactNativeWebView || location?.protocol !== 'http:'
    || !['127.0.0.1', 'localhost'].includes(location.hostname)
    || !/^\/releases\/[a-f0-9]{64}\/sandbox-viewer$/.test(location.pathname)) { return undefined; }
  const params = new URLSearchParams(location.search);
  const sessionId = params.get('puzzleSessionId');
  return params.get('puzzleBoardReview') === '1' && sessionId && SESSION_ID.test(sessionId) ? sessionId : undefined;
}

@Injectable({
  providedIn: 'root'
})
export class WebViewBridgeService implements OnDestroy {
  private _gameService: GameService | undefined;
  private receivedEvents = new WeakSet<Event>();
  private sessionId = nativePuzzleSessionId(window);
  private initialPending = this.sessionId !== undefined;
  private readonly seenSessionIds = new Set<string>();
  private switching = false;
  private destroyed = false;

  constructor(
    private injector: Injector,
    private sessionService: SessionService,
    private ngZone: NgZone
  ) {
    if (this.sessionId) { this.seenSessionIds.add(this.sessionId); }
    window.addEventListener('message', this.receiveMessage);
    document.addEventListener('message', this.receiveMessage);
    window.PrizeMapSimulator = Object.assign(window.PrizeMapSimulator || {}, {
      reset: (sessionId?: string): void => this.handleMessage({ type: 'ResetGame', sessionId }),
      ...(this.sessionId ? {
        loadPuzzle: (request: PuzzleLoadRequest): void => {
          void this.ngZone.run(() => this.loadPuzzle(request));
        }
      } : {})
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    window.removeEventListener('message', this.receiveMessage);
    document.removeEventListener('message', this.receiveMessage);
  }

  private get gameService(): GameService {
    if (!this._gameService) {
      this._gameService = this.injector.get(GameService);
    }
    return this._gameService;
  }

  private receiveMessage = (event: MessageEvent): void => {
    // A document message may also bubble through the window listener.
    if (this.receivedEvents.has(event)) { return; }
    this.receivedEvents.add(event);
    const fromParent = event.source === window.parent && window.parent !== window;
    // The native WebView dispatches messages on window or document in the verified loopback session.
    const fromNative = this.sessionId !== undefined && (event.source === null || event.source === window);
    this.handleMessage(event.data, fromParent || fromNative);
  };

  private handleMessage(messageData: unknown, allowHintCommand = false): void {
    if (this.destroyed) { return; }
    try {
      const value = typeof messageData === 'string' ? JSON.parse(messageData) : messageData;
      if (!value || typeof value !== 'object' || Array.isArray(value) || typeof value.type !== 'string') { return; }
      const message = value as WebViewMessage;

      // The iframe fallback may arrive back at this same window. It is an
      // outbound notification, so it must not trigger another Angular update.
      if (message.type === 'iframeEvent') { return; }
      const hintCommand = message.type === 'UndoPuzzleHint' || message.type === 'RequestPuzzleHintState';
      if (hintCommand && !allowHintCommand) { return; }
      if (this.sessionId && (this.switching || message.sessionId !== this.sessionId)) { return; }
      if (message.type === 'ResetGame' && message.data !== undefined
        && (!message.data || typeof message.data !== 'object' || Array.isArray(message.data))) { return; }
      if (message.type === 'SetBoardReadOnly' && message.data?.readOnly !== true) { return; }

      // Run inside Angular zone to ensure change detection works
      this.ngZone.run(() => {
        this.processMessage(message);
      });
    } catch (error) {
      console.error('Error handling WebView message:', error.message);
    }
  }

  private processMessage(message: WebViewMessage): void {
    switch (message.type) {
      case 'PushStateChange':
        this.handlePushStateChange(message.data);
        break;
      case 'RequestPuzzleHintState': {
        const activeGame = this.sessionService.session.gameStates.find(game => !game.deleted);
        if (activeGame) { this.gameService.requestPuzzleHintState(activeGame.gameId); }
        break;
      }
      case 'UndoPuzzleHint': {
        const activeGame = this.sessionService.session.gameStates.find(game => !game.deleted);
        if (activeGame) { this.gameService.undoPuzzleHint(activeGame.gameId); }
        break;
      }
      case 'ResetGame':
        this.handleResetGame();
        break;
      case 'SetBoardReadOnly': {
        const activeGame = this.sessionService.session.gameStates.find(game => !game.deleted);
        if (activeGame) { this.gameService.setBoardReadOnly(activeGame.gameId); }
        break;
      }
      // Add other message types here as needed
      default:
        console.warn('Unknown message type from WebView:', message.type);
    }
  }

  private handleResetGame(): void {
    const activeGame = this.sessionService.session.gameStates.find(game => game.deleted === false);
    if (!activeGame) {
      console.warn('No active game found to reset');
      return;
    }
    this.gameService.resetGame(activeGame.gameId);
  }

  private handlePushStateChange(data: { stateData: string }): void {
    // Find the current active game
    const gameStates = this.sessionService.session.gameStates;
    const activeGame = gameStates.find(g => g.deleted === false);

    if (!activeGame) {
      console.error('No active game found to push state change');
      return;
    }

    // Call the game service to push the state change
    this.gameService.pushStateChange(activeGame.gameId, data.stateData);
  }

  public initialPuzzleActivated(ok: boolean): void {
    const sessionId = this.sessionId;
    if (!this.initialPending || !sessionId) { return; }
    this.initialPending = false;
    this.postMessage({ type: 'PrizeMapPuzzleLoaded', sessionId, ok,
      ...(ok ? {} : { error: 'Could not open the puzzle' }) });
  }

  private async loadPuzzle(request: PuzzleLoadRequest): Promise<void> {
    const sessionId = request?.sessionId;
    if (this.destroyed || !this.sessionId || typeof sessionId !== 'string' || !SESSION_ID.test(sessionId)) { return; }
    const respond = (ok: boolean, error?: string): void => {
      this.postMessage({ type: 'PrizeMapPuzzleLoaded', sessionId, ok, ...(error ? { error } : {}) });
    };
    if (this.seenSessionIds.has(sessionId)) { return; }
    if (this.initialPending || this.switching || typeof request.stateData !== 'string' || !request.stateData) {
      respond(false, 'Invalid or overlapping puzzle load');
      return;
    }
    this.seenSessionIds.add(sessionId);
    this.switching = true;
    const previous = this.sessionId;
    try {
      const setupGeneration = beginPuzzleSetup();
      const snapshot = await this.injector.get(PuzzleCatalogService).prepareSnapshot(request.stateData, sessionId).toPromise();
      if (this.destroyed || !snapshot) { throw new Error('Could not prepare the new puzzle'); }
      markPuzzleSetup('metadataReady', setupGeneration);
      const router = this.injector.get(Router);
      // Unmount the previous table before displacing its session. Preserve the
      // document and its initialized catalog while recreating the Angular UI.
      if (!await router.navigate(['/sandbox-viewer'], { skipLocationChange: true }) || this.destroyed) {
        throw new Error('Could not leave the previous puzzle');
      }
      this.injector.get(SimulatorAssetsService).beginAttempt();
      this.sessionId = sessionId; // The new StateUpdate is emitted synchronously during creation.
      const capturePuzzleDecisions = new URLSearchParams(window.location.search).get('puzzleHints') === '1';
      const game = await this.gameService.createGameFromState(snapshot, undefined,
        { stopAfterOpponentDraw: true, closeDialogs: true, ...(capturePuzzleDecisions ? { capturePuzzleDecisions } : {}) }).toPromise().catch(error => {
        this.sessionId = previous;
        throw error;
      });
      markPuzzleSetup('engineReady', setupGeneration);
      if (this.destroyed || !game || !await router.navigate(['/table', game.localId], { skipLocationChange: true })) {
        throw new Error('Could not open the new puzzle');
      }
      // The native host replays matching state messages only after this ACK.
      respond(true);
      markPuzzleSetup('boardMounted', setupGeneration);
      window.requestAnimationFrame?.(() => window.requestAnimationFrame(() => markPuzzleSetup('boardPainted', setupGeneration)));
    } catch {
      respond(false, 'Could not open the new puzzle');
    } finally {
      this.switching = false;
    }
  }

  /**
   * Send a message to React Native WebView with iframe fallback
   * If ReactNativeWebView is not available (e.g., running in iframe),
   * it will post a window message with type "iframeEvent" instead
   */
  public postMessage(message: WebViewMessage): void {
    if (this.destroyed) { return; }
    const outgoing = this.sessionId && !message.sessionId ? { ...message, sessionId: this.sessionId } : message;
    try {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify(outgoing));
      } else {
        // Fallback to window.postMessage for iframe environments
        window.parent.postMessage({ type: 'iframeEvent', data: outgoing }, '*');
      }
    } catch (error) {
      // If ReactNativeWebView.postMessage fails, use iframe fallback
      console.warn('Failed to post to ReactNativeWebView, using iframe fallback:', error);
      window.parent.postMessage({ type: 'iframeEvent', data: outgoing }, '*');
    }
  }
}
