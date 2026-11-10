import { Injectable, NgZone, Injector } from '@angular/core';
import { GameService } from '../../api/services/game.service';
import { SessionService } from '../session/session.service';

export interface WebViewMessage {
  type: string;
  data?: any;
}

export interface PrizeMapSimulatorApi {
  reset(): void;
}

declare global {
  interface Window { PrizeMapSimulator?: PrizeMapSimulatorApi; }
}

@Injectable({
  providedIn: 'root'
})
export class WebViewBridgeService {
  private _gameService: GameService | undefined;
  private receivedEvents = new WeakSet<Event>();

  constructor(
    private injector: Injector,
    private sessionService: SessionService,
    private ngZone: NgZone
  ) {
    this.setupMessageListener();
    window.PrizeMapSimulator = Object.assign(window.PrizeMapSimulator || {}, {
      reset: (): void => this.handleMessage({ type: 'ResetGame' })
    });
  }

  private get gameService(): GameService {
    if (!this._gameService) {
      this._gameService = this.injector.get(GameService);
    }
    return this._gameService;
  }

  private setupMessageListener(): void {
    // Listen for messages from React Native
    window.addEventListener('message', (event) => {
      this.receiveMessage(event);
    });

    // Also listen for messages sent via document (alternative approach for some WebView implementations)
    document.addEventListener('message', (event: any) => {
      this.receiveMessage(event);
    });
  }

  private receiveMessage(event: MessageEvent): void {
    // A document message may also bubble through the window listener.
    if (this.receivedEvents.has(event)) { return; }
    this.receivedEvents.add(event);
    this.handleMessage(event.data);
  }

  private handleMessage(messageData: unknown): void {
    try {
      const value = typeof messageData === 'string' ? JSON.parse(messageData) : messageData;
      if (!value || typeof value !== 'object' || Array.isArray(value) || typeof value.type !== 'string') { return; }
      const message = value as WebViewMessage;

      // The iframe fallback may arrive back at this same window. It is an
      // outbound notification, so it must not trigger another Angular update.
      if (message?.type === 'iframeEvent') { return; }
      if (message.type === 'ResetGame' && message.data !== undefined
        && (!message.data || typeof message.data !== 'object' || Array.isArray(message.data))) { return; }

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
      case 'ResetGame':
        this.handleResetGame();
        break;
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

  /**
   * Send a message to React Native WebView with iframe fallback
   * If ReactNativeWebView is not available (e.g., running in iframe),
   * it will post a window message with type "iframeEvent" instead
   */
  public postMessage(message: WebViewMessage): void {
    try {
      if ((window as any).ReactNativeWebView) {
        (window as any).ReactNativeWebView.postMessage(JSON.stringify(message));
      } else {
        // Fallback to window.postMessage for iframe environments
        window.parent.postMessage({ type: 'iframeEvent', data: message }, '*');
      }
    } catch (error) {
      // If ReactNativeWebView.postMessage fails, use iframe fallback
      console.warn('Failed to post to ReactNativeWebView, using iframe fallback:', error);
      window.parent.postMessage({ type: 'iframeEvent', data: message }, '*');
    }
  }
}
