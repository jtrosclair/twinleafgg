import { State } from '../../game/store/state/state';
import { StateValidationResult } from './reconnection-conflict-resolver';
export interface ErrorRecoveryStrategy {
    name: string;
    priority: number;
    canHandle: (error: Error, context: ErrorRecoveryContext) => boolean;
    recover: (error: Error, context: ErrorRecoveryContext) => Promise<ErrorRecoveryResult>;
}
export interface ErrorRecoveryContext {
    gameId: number;
    userId: number;
    sessionId: string;
    preservedState?: State;
    serverState?: State;
    originalError: Error;
    attemptCount: number;
    maxAttempts: number;
}
export interface ErrorRecoveryResult {
    success: boolean;
    recoveredState?: State;
    fallbackApplied: boolean;
    strategy: string;
    error?: string;
    shouldRetry: boolean;
    retryDelay?: number;
}
export interface FallbackScenario {
    type: 'game_forfeit' | 'state_reset' | 'minimal_state' | 'server_state_only';
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    userMessage: string;
}
export declare class ReconnectionErrorRecovery {
    private conflictResolver;
    private recoveryStrategies;
    constructor();
    /**
     * Attempt to recover from reconnection errors
     */
    recoverFromError(error: Error, gameId: number, userId: number, preservedState?: State, serverState?: State, attemptCount?: number, maxAttempts?: number): Promise<ErrorRecoveryResult>;
    /**
     * Validate reconnection preconditions
     */
    validateReconnectionPreconditions(gameId: number, userId: number, preservedState?: State, serverState?: State): StateValidationResult;
    /**
     * Apply fallback scenario when recovery is not possible
     */
    private applyFallbackScenario;
    /**
     * Create a minimal valid state for emergency fallback
     */
    private createMinimalState;
    /**
     * Initialize recovery strategies
     */
    private initializeRecoveryStrategies;
}
