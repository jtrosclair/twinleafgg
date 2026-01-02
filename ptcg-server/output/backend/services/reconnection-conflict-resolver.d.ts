import { State } from '../../game/store/state/state';
export interface StateConflict {
    type: 'phase_mismatch' | 'turn_mismatch' | 'player_count_mismatch' | 'data_corruption' | 'version_mismatch';
    description: string;
    serverState: any;
    preservedState: any;
    severity: 'low' | 'medium' | 'high' | 'critical';
    resolvable: boolean;
}
export interface ConflictResolutionResult {
    success: boolean;
    resolvedState?: State;
    conflicts: StateConflict[];
    fallbackApplied: boolean;
    error?: string;
}
export interface StateValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    canRecover: boolean;
}
export declare class ReconnectionConflictResolver {
    /**
     * Detect conflicts between server state and preserved state
     */
    detectConflicts(serverState: State, preservedState: State, gameId: number, userId: number): StateConflict[];
    /**
     * Resolve conflicts between states
     */
    resolveConflicts(serverState: State, preservedState: State, conflicts: StateConflict[], gameId: number, userId: number): ConflictResolutionResult;
    /**
     * Validate state integrity before reconnection
     */
    validateState(state: State, gameId: number, userId: number): StateValidationResult;
    /**
     * Attempt to recover from corrupted state
     */
    recoverCorruptedState(corruptedState: State, fallbackState: State | null, gameId: number, userId: number): ConflictResolutionResult;
    /**
     * Apply fallback strategy when conflicts cannot be resolved
     */
    private applyFallbackStrategy;
    /**
     * Resolve phase conflicts
     */
    private resolvePhaseConflict;
    /**
     * Resolve turn conflicts
     */
    private resolveTurnConflict;
    /**
     * Resolve version conflicts
     */
    private resolveVersionConflict;
    /**
     * Check for data corruption indicators
     */
    private checkForDataCorruption;
    /**
     * Get severity of phase conflict
     */
    private getPhaseConflictSeverity;
    /**
     * Check if phase conflict is resolvable
     */
    private isPhaseConflictResolvable;
    /**
     * Check if game phase is valid
     */
    private isValidGamePhase;
    /**
     * Check state consistency
     */
    private checkStateConsistency;
    /**
     * Check if errors are recoverable
     */
    private canRecoverFromErrors;
    /**
     * Attempt to repair corrupted state
     */
    private attemptStateRepair;
}
