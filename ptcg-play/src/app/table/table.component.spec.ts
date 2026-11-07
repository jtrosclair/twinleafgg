import { Subject } from 'rxjs';
import { GamePhase, Player, State } from 'ptcg-server';
import { TableComponent } from './table.component';

describe('End Turn confirmation', () => {
  let table: TableComponent;
  let game: any;
  let dialog: any;
  let closed: Subject<boolean>;

  beforeEach(() => {
    closed = new Subject<boolean>();
    game = jasmine.createSpyObj('game', ['passTurnAction']);
    dialog = jasmine.createSpyObj('dialog', ['open']);
    dialog.open.and.returnValue({ afterClosed: () => closed.asObservable(), close: () => { closed.next(false); closed.complete(); } });
    table = new TableComponent(game, {} as any, {} as any, {} as any,
      { endBoardSelection() {} } as any, dialog);
    table.endTurnConfirmation = {} as any;
    const state = new State(); state.phase = GamePhase.PLAYER_TURN; state.turn = 5;
    const human = new Player(); human.id = 8;
    const opponent = new Player(); opponent.id = 13;
    state.players = [human, opponent]; state.activePlayer = 0;
    table.clientId = 8;
    table.gameState = { gameId: 42, localId: 7, state } as any;
  });

  async function answer(value: boolean) { closed.next(value); closed.complete(); await Promise.resolve(); }

  it('waits for explicit confirmation and submits once even after repeated clicks', async () => {
    const pending = table.endTurn();
    await table.endTurn();
    expect(dialog.open).toHaveBeenCalledTimes(1);
    expect(game.passTurnAction).not.toHaveBeenCalled();
    expect(table.isEndTurnConfirmationOpen).toBe(true);
    await answer(true); await pending;
    expect(game.passTurnAction).toHaveBeenCalledOnceWith(42);
    expect(table.isEndTurnConfirmationOpen).toBe(false);
  });

  it('keeps the turn when the user cancels or dismisses the dialog', async () => {
    const pending = table.endTurn();
    await answer(false); await pending;
    expect(game.passTurnAction).not.toHaveBeenCalled();
    expect(table.canEndTurn()).toBe(true);
  });

  it('refuses unavailable turns, completed games and pending prompts', async () => {
    for (const flag of ['deleted', 'turnComplete', 'promptMinimized']) {
      table.gameState[flag] = true;
      await table.endTurn();
      table.gameState[flag] = false;
    }
    table.gameState.state.activePlayer = 1; await table.endTurn();
    table.gameState.state.activePlayer = 0;
    table.gameState.state.prompts = [{ result: undefined }] as any; await table.endTurn();
    expect(dialog.open).not.toHaveBeenCalled();
    expect(game.passTurnAction).not.toHaveBeenCalled();
  });

  it('rechecks eligibility after confirmation rather than ending a changed turn', async () => {
    const pending = table.endTurn();
    table.gameState.state.activePlayer = 1;
    await answer(true); await pending;
    expect(game.passTurnAction).not.toHaveBeenCalled();
  });

  it('does not apply an old confirmation to a new game or turn', async () => {
    const pending = table.endTurn();
    table.gameState.state.turn++;
    await answer(true); await pending;
    expect(game.passTurnAction).not.toHaveBeenCalled();
  });

  it('cancels the confirmation when the table is destroyed', async () => {
    const pending = table.endTurn();
    table.ngOnDestroy(); await pending;
    expect(game.passTurnAction).not.toHaveBeenCalled();
  });
});
