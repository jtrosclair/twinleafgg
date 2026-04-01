import { Injectable, NgZone, Injector } from '@angular/core';
import { GameService } from '../../api/services/game.service';
import { SessionService } from '../session/session.service';

export interface WebViewMessage {
  type: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class WebViewBridgeService {
  private _gameService: GameService | undefined;

  constructor(
    private injector: Injector,
    private sessionService: SessionService,
    private ngZone: NgZone
  ) {
    this.setupMessageListener();
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
      this.handleMessage(event.data);
    });

    // Also listen for messages sent via document (alternative approach for some WebView implementations)
    document.addEventListener('message', (event: any) => {
      this.handleMessage(event.data);

    });
  }

  private handleMessage(messageData: string | WebViewMessage): void {
    try {
      let message: WebViewMessage;

      // Parse message if it's a string
      if (typeof messageData === 'string') {
        message = JSON.parse(messageData);
      } else {
        message = messageData;
      }

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
      // Add other message types here as needed
      default:
        console.warn('Unknown message type from WebView:', message.type);
    }
  }

  private handlePushStateChange(data: { stateData: string }): void {
    // Find the current active game
    console.log({ stateData: data.stateData })
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
    console.log({ message })
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
