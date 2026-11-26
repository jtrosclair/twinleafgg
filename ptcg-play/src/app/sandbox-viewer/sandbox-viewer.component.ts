import { Component, Inject, OnInit, OnDestroy, Optional } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { SessionService } from '../shared/session/session.service';
import { GameService } from '../api/services/game.service';
import { PuzzleCatalogService } from '../api/services/puzzle-catalog.service';
import { SimulatorAssetsService } from '../shared/services/simulator-assets.service';
import { beginPuzzleSetup, markPuzzleSetup, currentSetupGeneration } from '../shared/services/puzzle-setup-timing';
import { nativePuzzleSessionId, WebViewBridgeService } from '../shared/services/webview-bridge.service';
import { isPublicSimulatorFacade } from '../app-base-href';

@Component({
  selector: 'ptcg-sandbox-viewer',
  templateUrl: './sandbox-viewer.component.html',
  styleUrls: ['./sandbox-viewer.component.scss']
})
export class SandboxViewerComponent implements OnInit, OnDestroy {

  public stateDataInput = '';
  public loading = false;
  public initializingSession = true;
  public error = '';
  public isReady = false;

  private destroy$ = new Subject<void>();
  public autoStartState: string | null = null;
  public delayedMessage: string | null = null;
  private delayedMessageTimeouts: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService,
    private translate: TranslateService,
    private puzzleCatalog: PuzzleCatalogService,
    private gameService: GameService,
    private simulatorAssets: SimulatorAssetsService,
    @Inject(DOCUMENT) private document: Document,
    @Optional() private webViewBridge?: WebViewBridgeService
  ) { }

  ngOnInit(): void {
    // Check for state in URL hash (e.g., /sandbox-viewer#BASE64STATE)
    const hash = this.route.snapshot.fragment;
    if (hash) {
      this.autoStartState = hash;
      this.stateDataInput = hash;
      // Show delayed messages at different intervals if still loading
      this.delayedMessageTimeouts.push(setTimeout(() => {
        if (this.autoStartState && (this.loading || this.initializingSession)) {
          this.delayedMessage = 'Preparing the simulator…';
        }
      }, 4001));

      this.delayedMessageTimeouts.push(setTimeout(() => {
        if (this.autoStartState && (this.loading || this.initializingSession)) {
          this.delayedMessage = 'Loading the simulator. Card images load separately when needed.';
        }
      }, 15000));

      this.delayedMessageTimeouts.push(setTimeout(() => {
        if (this.autoStartState && (this.loading || this.initializingSession)) {
          this.delayedMessage = "The download is taking longer than usual. You can retry if it does not finish.";
        }
      }, 30000));

    }
    this.initializeSession();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.delayedMessageTimeouts.forEach(timeout => clearTimeout(timeout));
  }

  private initializeSession(): void {
    if (this.autoStartState) { beginPuzzleSetup(); }
    this.initializingSession = true;
    this.error = '';

    // The manual entry and the transition between native puzzles can render
    // without loading executable card rules. Prepare them from each snapshot.
    this.puzzleCatalog.checkMetadata()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.initializingSession = false;
          this.isReady = true;
          this.tryAutoStart();
        },
        error: (err) => {
          console.error('Error loading cards:', err);
          this.error = err.message || this.translate.instant('SANDBOX_VIEWER_CARDS_LOAD_ERROR');
          this.initializingSession = false;
          if (this.autoStartState) { this.webViewBridge?.initialPuzzleActivated(false); }
        }
      });
  }

  private tryAutoStart(): void {
    if (this.autoStartState) {
      this.loadGameState();
    }
  }

  public loadGameState(): void {
    if (this.loading) { return; }
    if (!this.stateDataInput.trim()) {
      this.error = this.translate.instant('SANDBOX_VIEWER_EMPTY_INPUT');
      return;
    }

    if (!this.isReady) {
      this.error = this.translate.instant('SANDBOX_VIEWER_NOT_READY');
      return;
    }

    this.loading = true;
    this.error = '';
    if (!this.autoStartState) { beginPuzzleSetup(); }
    const stateData = this.stateDataInput.trim();
    const setupGeneration = currentSetupGeneration();

    const loadFailed = (err: any): void => {
      console.error('Error creating game from state:', err);
      this.error = err?.message || this.translate.instant('SANDBOX_VIEWER_INVALID_DATA');
      this.loading = false;
      if (this.autoStartState) { this.webViewBridge?.initialPuzzleActivated(false); }
    };

    try {
      const query = this.route.snapshot.queryParamMap;
      const stopAfterOpponentDraw = query?.get('puzzleBoardReview') === '1';
      const viewBoard = query?.get('viewBoard') === '1';
      const capturePuzzleDecisions = query?.get('puzzleHints') === '1';
      this.puzzleCatalog.prepareSnapshot(stateData, nativePuzzleSessionId(this.document.defaultView))
        .pipe(switchMap(snapshot => {
          markPuzzleSetup('metadataReady', setupGeneration);
          // Card faces load only when rendered, independently of game readiness.
          this.simulatorAssets.beginAttempt();
          return stopAfterOpponentDraw || viewBoard || capturePuzzleDecisions
            ? this.gameService.createGameFromState(snapshot, undefined, { stopAfterOpponentDraw, viewBoard, ...(capturePuzzleDecisions ? { capturePuzzleDecisions } : {}) })
            : this.gameService.createGameFromState(snapshot);
        }), takeUntil(this.destroy$))
        .subscribe({
          next: (gameState) => {
            markPuzzleSetup('engineReady', setupGeneration);
            // Find the local game state that was created
            const localGameState = this.sessionService.session.gameStates
              .find(g => g.gameId === gameState.gameId);

            if (localGameState) {
              // Navigate to the table view using localId
              const keepDocumentLocation = isPublicSimulatorFacade(this.document) || nativePuzzleSessionId(this.document.defaultView);
              const navigationOptions = keepDocumentLocation ? { skipLocationChange: true } : undefined;
              this.router.navigate(['/table', localGameState.localId], navigationOptions).then(navigated => {
                if (this.autoStartState) { this.webViewBridge?.initialPuzzleActivated(navigated); }
                if (!navigated) { return; }
                markPuzzleSetup('boardMounted', setupGeneration);
                // Measure beyond the route change, after the board has had a paint.
                requestAnimationFrame(() => requestAnimationFrame(() => markPuzzleSetup('boardPainted', setupGeneration)));
              }, loadFailed);
            } else {
              this.error = this.translate.instant('SANDBOX_VIEWER_INVALID_DATA');
              this.loading = false;
              if (this.autoStartState) { this.webViewBridge?.initialPuzzleActivated(false); }
            }
          },
          error: loadFailed
        });
    } catch (err) {
      loadFailed(err);
    }
  }

  public retryConnection(): void {
    this.initializeSession();
  }

  public clearInput(): void {
    this.stateDataInput = '';
    this.error = '';
  }
}
