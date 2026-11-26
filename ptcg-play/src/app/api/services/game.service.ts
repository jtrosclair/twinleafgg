import { Injectable, NgZone, Optional } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  Action, AttackAction, Base64, CardTarget, GamePhase, GameWinner, PassTurnAction,
  PlayCardAction, ReorderBenchAction, ReorderHandAction, RetreatAction, State,
  StateSerializer, UseAbilityAction, UseEnergyAbilityAction, UseStadiumAction,
  UseTrainerAbilityAction, WinConditions
} from 'ptcg-server';
import { ClientSimulator } from 'ptcg-server/client';
import { defer, Observable, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '../../shared/alert/alert.service';
import { LocalGameState } from '../../shared/session/session.interface';
import { SessionService } from '../../shared/session/session.service';
import { BoardInteractionService } from '../../shared/services/board-interaction.service';
import { WebViewBridgeService } from '../../shared/services/webview-bridge.service';
import { decodePuzzlePayload } from '../../shared/services/puzzle-payload';

interface PuzzleBoardOptions {
  stopAfterOpponentDraw?: boolean;
  viewBoard?: boolean;
  closeDialogs?: boolean;
  capturePuzzleDecisions?: boolean;
}

/** Owns the single in-memory simulator and its presentation snapshot. */
@Injectable({ providedIn: 'root' })
export class GameService {
  private simulator: ClientSimulator | undefined;
  private simulatorGameId = 0;
  private loadingSnapshot = false;
  private terminalMessageSent = false;
  private initialSnapshot: string | undefined;

  constructor(
    private alertService: AlertService,
    private sessionService: SessionService,
    private translate: TranslateService,
    private boardInteractionService: BoardInteractionService,
    private ngZone: NgZone,
    private webViewBridgeService: WebViewBridgeService,
    @Optional() private dialog?: MatDialog
  ) { }

  public validateGameState(stateData: string): Observable<{ ok: boolean; valid: boolean; message?: string }> {
    return defer(() => {
      try {
        new ClientSimulator().validateSnapshot(decodePuzzlePayload(stateData));
        return of({ ok: true, valid: true });
      } catch (error) {
        return of({ ok: false, valid: false, message: error.message });
      }
    });
  }

  public createGameFromState(stateData: string, winConditions?: WinConditions, options: PuzzleBoardOptions = {}): Observable<LocalGameState> {
    return defer(() => {
      const snapshot = decodePuzzlePayload(stateData);
      const simulator = new ClientSimulator(() => {
        if (!this.loadingSnapshot && this.simulator === simulator) {
          this.ngZone.run(() => this.publishState());
        }
      });
      this.loadingSnapshot = true;
      let serialized: string, state: State;
      try {
        simulator.loadSnapshot({
          stateData: snapshot, winConditions: winConditions && { ...winConditions },
          stopAfterOpponentDraw: options.stopAfterOpponentDraw, readOnly: options.viewBoard,
          capturePuzzleDecisions: options.capturePuzzleDecisions
        });
        serialized = simulator.getStateData();
        state = this.decodeState(serialized);
      } catch (error) {
        simulator.cleanup();
        throw error;
      } finally {
        this.loadingSnapshot = false;
      }
      this.boardInteractionService.endBoardSelection();
      this.simulator?.cleanup();
      this.simulator = simulator;
      this.simulatorGameId = Math.max(this.simulatorGameId, this.sessionService.session.lastGameId) + 1;
      const localId = this.sessionService.session.lastGameId + 1;
      this.terminalMessageSent = false;
      this.initialSnapshot = options.viewBoard ? undefined : serialized;
      if (options.closeDialogs) { this.dialog?.closeAll(); }
      const game: LocalGameState = {
        gameId: this.simulatorGameId, localId, clientSide: true, stateData: serialized, state,
        deleted: false, gameOver: false, promptMinimized: false,
        turnComplete: simulator.complete, logs: state.logs,
        canViewBoard: !!(options.stopAfterOpponentDraw || options.viewBoard), boardReadOnly: options.viewBoard === true
      };
      this.sessionService.set({ clientId: simulator.humanPlayerId, gameStates: [game], lastGameId: localId });
      this.publishState({ stateData: serialized, state });
      return of(game);
    });
  }

  public setPromptMinimized(localId: number, minimized: boolean): void {
    const game = this.sessionService.session.gameStates[0];
    if (game?.localId === localId && !game.boardReadOnly) {
      this.sessionService.set({ gameStates: [{ ...game, promptMinimized: minimized }] });
    }
  }

  public removeGameState(gameId: number): void {
    if (gameId === this.simulatorGameId) {
      this.simulator?.cleanup();
      this.simulator = undefined;
      this.initialSnapshot = undefined;
      this.boardInteractionService.endBoardSelection();
      this.sessionService.set({ gameStates: [] });
    }
  }

  public ability(gameId: number, name: string, target: CardTarget): void {
    this.action(gameId, sim => new UseAbilityAction(sim.humanPlayerId, name, target));
  }
  public trainerAbility(gameId: number, name: string, target: CardTarget): void {
    this.action(gameId, sim => new UseTrainerAbilityAction(sim.humanPlayerId, name, target));
  }
  public energyAbility(gameId: number, name: string, target: CardTarget): void {
    this.action(gameId, sim => new UseEnergyAbilityAction(sim.humanPlayerId, name, target));
  }
  public attack(gameId: number, name: string): void {
    this.action(gameId, sim => new AttackAction(sim.humanPlayerId, name));
  }
  public stadium(gameId: number): void {
    this.action(gameId, sim => new UseStadiumAction(sim.humanPlayerId));
  }
  public playCardAction(gameId: number, handIndex: number, target: CardTarget): void {
    this.action(gameId, sim => new PlayCardAction(sim.humanPlayerId, handIndex, target));
  }
  public reorderBenchAction(gameId: number, from: number, to: number): void {
    this.action(gameId, sim => new ReorderBenchAction(sim.humanPlayerId, from, to));
  }
  public reorderHandAction(gameId: number, order: number[]): void {
    this.action(gameId, sim => new ReorderHandAction(sim.humanPlayerId, order));
  }
  public retreatAction(gameId: number, to: number): void {
    this.action(gameId, sim => new RetreatAction(sim.humanPlayerId, to));
  }
  public passTurnAction(gameId: number): void {
    this.action(gameId, sim => new PassTurnAction(sim.humanPlayerId));
  }
  public resolvePrompt(gameId: number, promptId: number, result: any): void {
    this.run(gameId, sim => sim.resolvePrompt(promptId, result));
  }

  public setBoardReadOnly(gameId: number): void {
    const game = this.sessionService.session.gameStates[0];
    if (game?.gameId !== gameId || game.deleted || !game.canViewBoard || game.boardReadOnly) { return; }
    this.boardInteractionService.endBoardSelection();
    this.dialog?.closeAll();
    this.sessionService.set({ gameStates: [{ ...game, boardReadOnly: true, promptMinimized: false }] });
  }

  public canUndo(gameId: number): Observable<boolean> {
    return defer(() => {
      const simulator = this.requireSimulator(gameId);
      return of(!this.sessionService.session.gameStates[0].boardReadOnly && simulator.canUndo());
    });
  }

  public undo(gameId: number): void {
    this.run(gameId, sim => {
      if (sim.canUndo()) { this.restore(() => sim.undo()); }
    });
  }

  public requestPuzzleHintState(gameId: number): void {
    this.run(gameId, simulator => {
      if (simulator.getPuzzleHintContext()) this.publishState();
    });
  }

  public undoPuzzleHint(gameId: number): void {
    this.run(gameId, simulator => {
      if (simulator.getPuzzleHintContext()?.undoStateData) this.restore(() => simulator.undo());
    });
  }

  public pushStateChange(gameId: number, stateData: string): void {
    this.run(gameId, sim => this.restore(() => sim.pushState(stateData)));
  }

  public resetGame(gameId: number): void {
    this.run(gameId, sim => {
      const initialSnapshot = this.initialSnapshot;
      if (initialSnapshot === undefined) { return; }
      this.restore(() => sim.pushState(initialSnapshot), { resetPresentation: true });
    }, true);
  }

  private restore(operation: () => unknown, options: { resetPresentation?: boolean } = {}): void {
    this.loadingSnapshot = true;
    try { operation(); } finally { this.loadingSnapshot = false; }
    this.terminalMessageSent = false;
    this.boardInteractionService.endBoardSelection();
    if (options.resetPresentation) { this.dialog?.closeAll(); }
    this.webViewBridgeService.postMessage({ type: 'UndoDetected', data: {} });
    this.publishState(undefined, options.resetPresentation);
  }

  private action(gameId: number, build: (simulator: ClientSimulator) => Action): void {
    this.run(gameId, simulator => simulator.dispatch(build(simulator)));
  }

  private run(gameId: number, operation: (simulator: ClientSimulator) => unknown, allowReadOnly = false): void {
    try {
      const simulator = this.requireSimulator(gameId);
      if (allowReadOnly || !this.sessionService.session.gameStates[0].boardReadOnly) { operation(simulator); }
    } catch (error) {
      const message = String(error.message || error);
      const translations = this.translate.translations[this.translate.currentLang]
        || this.translate.translations[this.translate.defaultLang];
      const key = translations?.GAME_MESSAGES?.[message] ? 'GAME_MESSAGES.' + message : 'ERROR_UNKNOWN';
      this.alertService.toast(this.translate.instant(key));
    }
  }

  private requireSimulator(gameId: number): ClientSimulator {
    const game = this.sessionService.session.gameStates[0];
    if (!this.simulator || gameId !== this.simulatorGameId || !game || game.gameId !== gameId || game.deleted) {
      throw new Error('GAME_INVALID_ID');
    }
    return this.simulator;
  }

  private publishState(prepared?: { stateData: string; state: State }, resetPresentation = false): void {
    const simulator = this.simulator;
    const previous = this.sessionService.session.gameStates[0];
    if (!simulator || !previous || previous.gameId !== this.simulatorGameId) { return; }
    const stateData = prepared?.stateData ?? simulator.getStateData();
    const state = prepared?.state ?? this.decodeState(stateData);
    const pendingPrompt = state.prompts.find(prompt => prompt.playerId === simulator.humanPlayerId && prompt.result === undefined);
    const previousPrompt = previous.state.prompts.find(prompt => prompt.playerId === simulator.humanPlayerId && prompt.result === undefined);
    // Minimization belongs to one pending human prompt, never to the next action.
    const promptMinimized = !resetPresentation && previous.promptMinimized && pendingPrompt !== undefined
      && pendingPrompt.id === previousPrompt?.id && pendingPrompt.type === previousPrompt?.type;
    const boardReadOnly = !resetPresentation && previous.boardReadOnly;
    this.sessionService.set({ gameStates: [{ ...previous, stateData, state, logs: state.logs, turnComplete: simulator.complete,
      promptMinimized, boardReadOnly, ...(resetPresentation ? { gameOver: false } : {}) }] });
    this.boardInteractionService.updateGameLogs(state.logs);
    const capability = previous.canViewBoard ? { canViewBoard: true } : {};
    const hintContext = simulator.getPuzzleHintContext();
    this.webViewBridgeService.postMessage({
      type: 'StateUpdate',
      data: { stateData, ...capability, ...(hintContext ? { hintContext } : {}) },
    });
    if (simulator.complete && !this.terminalMessageSent && !boardReadOnly) {
      this.terminalMessageSent = true;
      const win = state.winner === GameWinner.PLAYER_1;
      const lossSnapshot = previous.canViewBoard ? { ...capability, stateData } : {};
      this.webViewBridgeService.postMessage(state.phase === GamePhase.FINISHED
        ? { type: 'GameOver', data: win ? { winner: 'player1' } : { winner: 'player2', ...lossSnapshot } }
        : { type: 'TurnEnd', data: lossSnapshot });
    }
  }

  private decodeState(stateData: string): State {
    return new StateSerializer().deserialize(new Base64().decode(stateData));
  }
}
