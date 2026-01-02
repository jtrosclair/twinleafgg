"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reconnection_conflict_resolver_1 = require("./reconnection-conflict-resolver");
const state_1 = require("../../game/store/state/state");
const player_1 = require("../../game/store/state/player");
describe('ReconnectionConflictResolver', () => {
    let resolver;
    let mockServerState;
    let mockPreservedState;
    beforeEach(() => {
        resolver = new reconnection_conflict_resolver_1.ReconnectionConflictResolver();
        mockServerState = new state_1.State();
        mockServerState.phase = state_1.GamePhase.PLAYER_TURN;
        mockServerState.activePlayer = 0;
        mockServerState.winner = state_1.GameWinner.NONE;
        mockServerState.turn = 1;
        mockServerState.players = [new player_1.Player(), new player_1.Player()];
        mockPreservedState = new state_1.State();
        mockPreservedState.phase = state_1.GamePhase.PLAYER_TURN;
        mockPreservedState.activePlayer = 0;
        mockPreservedState.winner = state_1.GameWinner.NONE;
        mockPreservedState.turn = 1;
        mockPreservedState.players = [new player_1.Player(), new player_1.Player()];
    });
    describe('detectConflicts', () => {
        it('should detect no conflicts when states are identical', () => {
            const conflicts = resolver.detectConflicts(mockServerState, mockPreservedState, 1, 1);
            expect(conflicts.length).toBe(0);
        });
        it('should detect phase mismatch conflicts', () => {
            mockPreservedState.phase = state_1.GamePhase.FINISHED;
            const conflicts = resolver.detectConflicts(mockServerState, mockPreservedState, 1, 1);
            expect(conflicts.length).toBe(1);
            expect(conflicts[0].type).toBe('phase_mismatch');
        });
        it('should detect turn mismatch conflicts', () => {
            mockPreservedState.activePlayer = 1;
            const conflicts = resolver.detectConflicts(mockServerState, mockPreservedState, 1, 1);
            expect(conflicts.length).toBe(1);
            expect(conflicts[0].type).toBe('turn_mismatch');
        });
    });
    describe('validateState', () => {
        it('should validate a correct state', () => {
            const result = resolver.validateState(mockServerState, 1, 1);
            expect(result.isValid).toBe(true);
            expect(result.errors.length).toBe(0);
        });
        it('should detect null state', () => {
            const result = resolver.validateState(null, 1, 1);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('State is null or undefined');
        });
    });
});
