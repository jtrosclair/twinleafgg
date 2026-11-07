import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Player, GamePhase } from 'ptcg-server';
import { combineLatest } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { GameService } from '../api/services/game.service';
import { LocalGameState } from '../shared/session/session.interface';
import { SessionService } from '../shared/session/session.service';
import { BoardInteractionService } from '../shared/services/board-interaction.service';

@UntilDestroy()
@Component({ selector: 'ptcg-table', templateUrl: './table.component.html', styleUrls: ['./table.component.scss'] })
export class TableComponent implements OnInit, OnDestroy {
  public gameState: LocalGameState;
  public bottomPlayer: Player;
  public topPlayer: Player;
  public clientId: number;
  public waiting = false;
  public canUndoBackend = false;
  public isHandHidden = false;
  public isEndTurnConfirmationOpen = false;
  @ViewChild('endTurnConfirmation') public endTurnConfirmation: TemplateRef<unknown>;
  private endTurnDialog?: MatDialogRef<unknown, boolean>;

  public get topHandCount(): number {
    return this.opponentPlayer?.hand?.cards?.length || 0;
  }

  public get topDeckCount(): number {
    return this.opponentPlayer?.deck?.cards?.length || 0;
  }

  public get topPrizeCount(): number {
    return this.opponentPlayer?.prizes?.filter(prize => prize.cards.length > 0).length || 0;
  }

  private get opponentPlayer(): Player {
    return this.topPlayer?.id === this.clientId ? this.bottomPlayer : this.topPlayer;
  }

  public get bottomHandCount(): number {
    return (this.topPlayer?.id === this.clientId ? this.topPlayer : this.bottomPlayer)?.hand?.cards?.length || 0;
  }

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService,
    private boardInteractionService: BoardInteractionService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.boardInteractionService.endBoardSelection();
    combineLatest([
      this.route.paramMap,
      this.sessionService.get(session => session.gameStates, session => session.clientId)
    ]).pipe(untilDestroyed(this)).subscribe(([params, [games, clientId]]) => {
      const localId = Number(params.get('gameId'));
      this.gameState = games.find(game => game.localId === localId);
      this.updatePlayers(this.gameState, clientId);
      this.updateCanUndo();
    });
  }

  ngOnDestroy(): void {
    this.endTurnDialog?.close(false);
    this.boardInteractionService.endBoardSelection();
  }

  private updatePlayers(game: LocalGameState, clientId: number): void {
    this.clientId = clientId;
    this.waiting = false;
    if (!game) { this.router.navigate(['/sandbox-viewer']); return; }
    this.bottomPlayer = game.state.players[0];
    this.topPlayer = game.state.players[1];
    const prompts = game.state.prompts.filter(prompt => prompt.result === undefined);
    this.waiting = !game.turnComplete && !prompts.some(prompt => prompt.playerId === clientId)
      && (prompts.some(prompt => prompt.playerId !== clientId)
        || game.state.players[game.state.activePlayer]?.id !== clientId);
  }

  private updateCanUndo(): void {
    const game = this.gameState;
    if (!game || game.deleted) { this.canUndoBackend = false; return; }
    this.gameService.canUndo(game.gameId).subscribe(canUndo => {
      if (this.gameState?.gameId === game.gameId) { this.canUndoBackend = canUndo; }
    }, () => { this.canUndoBackend = false; });
  }

  public canEndTurn(): boolean {
    const game = this.gameState;
    return !!game && !game.deleted && !game.turnComplete && !game.promptMinimized && game.state.phase === GamePhase.PLAYER_TURN
      && game.state.players[game.state.activePlayer]?.id === this.clientId && !this.hasActivePrompt();
  }

  public async endTurn(): Promise<void> {
    if (!this.canEndTurn() || this.isEndTurnConfirmationOpen || !this.endTurnConfirmation) { return; }
    const { gameId, localId } = this.gameState;
    const turn = this.gameState.state.turn;
    this.isEndTurnConfirmationOpen = true;
    try {
      this.endTurnDialog = this.dialog.open(this.endTurnConfirmation, {
        width: '340px', maxWidth: 'calc(100vw - 32px)',
        ariaLabelledBy: 'end-turn-confirm-title'
      });
      const confirmed = await this.endTurnDialog.afterClosed().toPromise();
      if (confirmed === true && this.canEndTurn() && this.gameState.gameId === gameId
        && this.gameState.localId === localId && this.gameState.state.turn === turn) {
        this.gameService.passTurnAction(gameId);
      }
    } finally {
      this.endTurnDialog = undefined;
      this.isEndTurnConfirmationOpen = false;
    }
  }

  public undo(): void {
    if (!this.gameState || !this.canUndoBackend || this.hasActivePrompt()) { return; }
    this.canUndoBackend = false;
    this.gameService.undo(this.gameState.gameId);
  }

  public toggleHandVisibility(): void { this.isHandHidden = !this.isHandHidden; }
  public hasActivePrompt(): boolean { return this.gameState?.state.prompts.some(prompt => prompt.result === undefined) || false; }
}
