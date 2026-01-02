"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reconnection_error_recovery_1 = require("./reconnection-error-recovery");
const state_1 = require("../../game/store/state/state");
const player_1 = require("../../game/store/state/player");
describe('ReconnectionErrorRecovery', () => {
    let errorRecovery;
    let mockState;
    beforeEach(() => {
        errorRecovery = new reconnection_error_recovery_1.ReconnectionErrorRecovery();
        mockState = new state_1.State();
        mockState.phase = state_1.GamePhase.PLAYER_TURN;
        mockState.activePlayer = 0;
        mockState.winner = state_1.GameWinner.NONE;
        mockState.turn = 1;
        mockState.players = [new player_1.Player(), new player_1.Player()];
    });
    describe('recoverFromError', () => {
        it('should successfully recover from state conflict errors', async () => {
            const conflictError = new Error('State conflict detected');
            const result = await errorRecovery.recoverFromError(conflictError, 1, 1, mockState, mockState, 1, 3);
            expect(result.success).toBe(true);
            expect(result.strategy).toBe('state_conflict_resolution');
            expect(result.recoveredState).toBeDefined();
        });
        it('should recover from serialization errors', async () => {
            const serializationError = new Error('JSON parse error');
            const result = await errorRecovery.recoverFromError(serializationError, 1, 1, undefined, mockState, 1, 3);
            expect(result.success).toBe(true);
            expect(result.strategy).toBe('serialization_error_recovery');
            expect(result.recoveredState).toEqual(mockState);
        });
        it('should apply fallback when no strategies work', async () => {
            const unrecoverableError = new Error('Unrecoverable error');
            const result = await errorRecovery.recoverFromError(unrecoverableError, 1, 1, undefined, undefined, 1, 3);
            expect(result.success).toBe(false);
            expect(result.fallbackApplied).toBe(true);
            expect(result.strategy).toBe('game_forfeit');
        });
    });
    describe('validateReconnectionPreconditions', () => {
        it('should validate successful preconditions', () => {
            const result = errorRecovery.validateReconnectionPreconditions(1, 1, mockState, mockState);
            expect(result.isValid).toBe(true);
            expect(result.errors.length).toBe(0);
            expect(result.canRecover).toBe(true);
        });
        it('should fail when no states are available', () => {
            const result = errorRecovery.validateReconnectionPreconditions(1, 1, undefined, undefined);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('No valid state available for reconnection');
            expect(result.canRecover).toBe(false);
        });
    });
});
