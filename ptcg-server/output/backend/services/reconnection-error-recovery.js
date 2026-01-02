"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReconnectionErrorRecovery = void 0;
const logger_1 = require("../../utils/logger");
const game_error_1 = require("../../game/game-error");
const reconnection_conflict_resolver_1 = require("./reconnection-conflict-resolver");
class ReconnectionErrorRecovery {
    constructor() {
        this.conflictResolver = new reconnection_conflict_resolver_1.ReconnectionConflictResolver();
        this.recoveryStrategies = this.initializeRecoveryStrategies();
    }
    /**
     * Attempt to recover from reconnection errors
     */
    async recoverFromError(error, gameId, userId, preservedState, serverState, attemptCount = 1, maxAttempts = 3) {
        const sessionId = `error-recovery-${userId}-${gameId}-${Date.now()}`;
        const context = {
            gameId,
            userId,
            sessionId,
            preservedState,
            serverState,
            originalError: error,
            attemptCount,
            maxAttempts
        };
        try {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.INFO,
                category: 'error-recovery',
                message: 'Starting error recovery',
                userId,
                gameId,
                sessionId,
                data: {
                    errorType: error.constructor.name,
                    errorMessage: error.message,
                    attemptCount,
                    maxAttempts,
                    hasPreservedState: !!preservedState,
                    hasServerState: !!serverState
                }
            });
            // Find applicable recovery strategies
            const applicableStrategies = this.recoveryStrategies
                .filter(strategy => strategy.canHandle(error, context))
                .sort((a, b) => b.priority - a.priority);
            if (applicableStrategies.length === 0) {
                logger_1.logger.logStructured({
                    level: logger_1.LogLevel.WARN,
                    category: 'error-recovery',
                    message: 'No applicable recovery strategies found',
                    userId,
                    gameId,
                    sessionId,
                    data: { errorType: error.constructor.name }
                });
                return this.applyFallbackScenario(context, {
                    type: 'game_forfeit',
                    description: 'No recovery strategy available',
                    severity: 'critical',
                    userMessage: 'Unable to recover from connection error. The game will be forfeited.'
                });
            }
            // Try each strategy in priority order
            for (const strategy of applicableStrategies) {
                try {
                    logger_1.logger.logStructured({
                        level: logger_1.LogLevel.INFO,
                        category: 'error-recovery',
                        message: 'Attempting recovery strategy',
                        userId,
                        gameId,
                        sessionId,
                        data: {
                            strategyName: strategy.name,
                            strategyPriority: strategy.priority
                        }
                    });
                    const result = await strategy.recover(error, context);
                    if (result.success) {
                        logger_1.logger.logStructured({
                            level: logger_1.LogLevel.INFO,
                            category: 'error-recovery',
                            message: 'Recovery strategy successful',
                            userId,
                            gameId,
                            sessionId,
                            data: {
                                strategyName: strategy.name,
                                fallbackApplied: result.fallbackApplied
                            }
                        });
                        return result;
                    }
                    else if (!result.shouldRetry) {
                        logger_1.logger.logStructured({
                            level: logger_1.LogLevel.WARN,
                            category: 'error-recovery',
                            message: 'Recovery strategy failed without retry',
                            userId,
                            gameId,
                            sessionId,
                            data: {
                                strategyName: strategy.name,
                                error: result.error
                            }
                        });
                        // If strategy explicitly says not to retry, move to next strategy
                        continue;
                    }
                }
                catch (strategyError) {
                    logger_1.logger.logStructured({
                        level: logger_1.LogLevel.ERROR,
                        category: 'error-recovery',
                        message: 'Recovery strategy threw error',
                        userId,
                        gameId,
                        sessionId,
                        data: { strategyName: strategy.name },
                        error: strategyError
                    });
                    // Continue to next strategy
                    continue;
                }
            }
            // If all strategies failed, apply fallback
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.ERROR,
                category: 'error-recovery',
                message: 'All recovery strategies failed',
                userId,
                gameId,
                sessionId,
                data: { strategiesAttempted: applicableStrategies.length }
            });
            return this.applyFallbackScenario(context, {
                type: 'game_forfeit',
                description: 'All recovery strategies exhausted',
                severity: 'critical',
                userMessage: 'Unable to recover from connection error after multiple attempts. The game will be forfeited.'
            });
        }
        catch (error) {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.ERROR,
                category: 'error-recovery',
                message: 'Error during recovery process',
                userId,
                gameId,
                sessionId,
                error: error
            });
            return {
                success: false,
                fallbackApplied: true,
                strategy: 'error_handler',
                error: `Recovery process failed: ${error}`,
                shouldRetry: false
            };
        }
    }
    /**
     * Validate reconnection preconditions
     */
    validateReconnectionPreconditions(gameId, userId, preservedState, serverState) {
        const sessionId = `precondition-validation-${userId}-${gameId}-${Date.now()}`;
        const errors = [];
        const warnings = [];
        try {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.INFO,
                category: 'precondition-validation',
                message: 'Validating reconnection preconditions',
                userId,
                gameId,
                sessionId,
                data: {
                    hasPreservedState: !!preservedState,
                    hasServerState: !!serverState
                }
            });
            // Check if we have at least one valid state
            if (!preservedState && !serverState) {
                errors.push('No valid state available for reconnection');
                return { isValid: false, errors, warnings, canRecover: false };
            }
            // Validate preserved state if available
            if (preservedState) {
                const preservedValidation = this.conflictResolver.validateState(preservedState, gameId, userId);
                if (!preservedValidation.isValid) {
                    if (preservedValidation.canRecover) {
                        warnings.push('Preserved state has recoverable issues');
                    }
                    else {
                        errors.push('Preserved state is corrupted and unrecoverable');
                    }
                }
            }
            // Validate server state if available
            if (serverState) {
                const serverValidation = this.conflictResolver.validateState(serverState, gameId, userId);
                if (!serverValidation.isValid) {
                    if (serverValidation.canRecover) {
                        warnings.push('Server state has recoverable issues');
                    }
                    else {
                        errors.push('Server state is corrupted and unrecoverable');
                    }
                }
            }
            // Check for state conflicts if both states are available
            if (preservedState && serverState) {
                const conflicts = this.conflictResolver.detectConflicts(serverState, preservedState, gameId, userId);
                const criticalConflicts = conflicts.filter(c => c.severity === 'critical');
                const unresolvableConflicts = conflicts.filter(c => !c.resolvable);
                if (criticalConflicts.length > 0) {
                    errors.push(`Critical state conflicts detected: ${criticalConflicts.map(c => c.type).join(', ')}`);
                }
                if (unresolvableConflicts.length > 0) {
                    errors.push(`Unresolvable state conflicts detected: ${unresolvableConflicts.map(c => c.type).join(', ')}`);
                }
                if (conflicts.length > 0 && criticalConflicts.length === 0) {
                    warnings.push(`State conflicts detected but may be resolvable: ${conflicts.map(c => c.type).join(', ')}`);
                }
            }
            const isValid = errors.length === 0;
            const canRecover = isValid || (errors.length > 0 && warnings.length > 0);
            logger_1.logger.logStructured({
                level: isValid ? logger_1.LogLevel.INFO : logger_1.LogLevel.WARN,
                category: 'precondition-validation',
                message: 'Precondition validation completed',
                userId,
                gameId,
                sessionId,
                data: {
                    isValid,
                    errorCount: errors.length,
                    warningCount: warnings.length,
                    canRecover
                }
            });
            return { isValid, errors, warnings, canRecover };
        }
        catch (error) {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.ERROR,
                category: 'precondition-validation',
                message: 'Error during precondition validation',
                userId,
                gameId,
                sessionId,
                error: error
            });
            return {
                isValid: false,
                errors: [`Precondition validation failed: ${error}`],
                warnings,
                canRecover: false
            };
        }
    }
    /**
     * Apply fallback scenario when recovery is not possible
     */
    async applyFallbackScenario(context, scenario) {
        logger_1.logger.logStructured({
            level: logger_1.LogLevel.WARN,
            category: 'error-recovery',
            message: 'Applying fallback scenario',
            userId: context.userId,
            gameId: context.gameId,
            sessionId: context.sessionId,
            data: {
                scenarioType: scenario.type,
                scenarioSeverity: scenario.severity,
                description: scenario.description
            }
        });
        switch (scenario.type) {
            case 'server_state_only':
                if (context.serverState) {
                    return {
                        success: true,
                        recoveredState: context.serverState,
                        fallbackApplied: true,
                        strategy: 'server_state_fallback',
                        shouldRetry: false
                    };
                }
                break;
            case 'minimal_state':
                const minimalState = this.createMinimalState(context.gameId, context.userId);
                if (minimalState) {
                    return {
                        success: true,
                        recoveredState: minimalState,
                        fallbackApplied: true,
                        strategy: 'minimal_state_fallback',
                        shouldRetry: false
                    };
                }
                break;
            case 'state_reset':
                // This would require game-specific logic to reset to a safe state
                // For now, we'll treat it as a forfeit
                break;
            case 'game_forfeit':
            default:
                return {
                    success: false,
                    fallbackApplied: true,
                    strategy: 'game_forfeit',
                    error: scenario.userMessage,
                    shouldRetry: false
                };
        }
        // If fallback scenario couldn't be applied, forfeit the game
        return {
            success: false,
            fallbackApplied: true,
            strategy: 'game_forfeit',
            error: 'Unable to apply fallback scenario',
            shouldRetry: false
        };
    }
    /**
     * Create a minimal valid state for emergency fallback
     */
    createMinimalState(gameId, userId) {
        try {
            // This would create a minimal valid state based on game rules
            // For now, return null as this requires game-specific implementation
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.WARN,
                category: 'error-recovery',
                message: 'Minimal state creation not implemented',
                userId,
                gameId,
                data: { reason: 'requires_game_specific_implementation' }
            });
            return null;
        }
        catch (error) {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.ERROR,
                category: 'error-recovery',
                message: 'Error creating minimal state',
                userId,
                gameId,
                error: error
            });
            return null;
        }
    }
    /**
     * Initialize recovery strategies
     */
    initializeRecoveryStrategies() {
        return [
            // Strategy 1: State Conflict Resolution
            {
                name: 'state_conflict_resolution',
                priority: 100,
                canHandle: (error, context) => {
                    return !!(context.preservedState && context.serverState &&
                        (error.message.includes('conflict') || error.message.includes('mismatch')));
                },
                recover: async (error, context) => {
                    if (!context.preservedState || !context.serverState) {
                        return {
                            success: false, fallbackApplied: false, strategy: 'state_conflict_resolution',
                            error: 'Missing required states', shouldRetry: false
                        };
                    }
                    const conflicts = this.conflictResolver.detectConflicts(context.serverState, context.preservedState, context.gameId, context.userId);
                    const resolution = this.conflictResolver.resolveConflicts(context.serverState, context.preservedState, conflicts, context.gameId, context.userId);
                    return {
                        success: resolution.success,
                        recoveredState: resolution.resolvedState,
                        fallbackApplied: resolution.fallbackApplied,
                        strategy: 'state_conflict_resolution',
                        error: resolution.success ? undefined : 'Conflict resolution failed',
                        shouldRetry: !resolution.success && context.attemptCount < context.maxAttempts
                    };
                }
            },
            // Strategy 2: State Corruption Recovery
            {
                name: 'state_corruption_recovery',
                priority: 90,
                canHandle: (error, context) => {
                    return error.message.includes('corrupt') || error.message.includes('invalid') ||
                        error.message.includes('serializ') || error instanceof game_error_1.GameError;
                },
                recover: async (error, context) => {
                    // Try to recover from corrupted preserved state
                    if (context.preservedState) {
                        const recovery = this.conflictResolver.recoverCorruptedState(context.preservedState, context.serverState || null, context.gameId, context.userId);
                        if (recovery.success) {
                            return {
                                success: true,
                                recoveredState: recovery.resolvedState,
                                fallbackApplied: recovery.fallbackApplied,
                                strategy: 'state_corruption_recovery',
                                shouldRetry: false
                            };
                        }
                    }
                    // If preserved state recovery failed, try server state
                    if (context.serverState) {
                        const validation = this.conflictResolver.validateState(context.serverState, context.gameId, context.userId);
                        if (validation.isValid || validation.canRecover) {
                            return {
                                success: true,
                                recoveredState: context.serverState,
                                fallbackApplied: true,
                                strategy: 'state_corruption_recovery',
                                shouldRetry: false
                            };
                        }
                    }
                    return {
                        success: false,
                        fallbackApplied: false,
                        strategy: 'state_corruption_recovery',
                        error: 'Unable to recover from state corruption',
                        shouldRetry: context.attemptCount < context.maxAttempts,
                        retryDelay: 1000 * context.attemptCount // Exponential backoff
                    };
                }
            },
            // Strategy 3: Serialization Error Recovery
            {
                name: 'serialization_error_recovery',
                priority: 80,
                canHandle: (error, context) => {
                    return error.message.includes('serialize') || error.message.includes('deserialize') ||
                        error.message.includes('JSON') || error.message.includes('parse');
                },
                recover: async (error, context) => {
                    // For serialization errors, prefer server state if available
                    if (context.serverState) {
                        const validation = this.conflictResolver.validateState(context.serverState, context.gameId, context.userId);
                        if (validation.isValid) {
                            return {
                                success: true,
                                recoveredState: context.serverState,
                                fallbackApplied: true,
                                strategy: 'serialization_error_recovery',
                                shouldRetry: false
                            };
                        }
                    }
                    return {
                        success: false,
                        fallbackApplied: false,
                        strategy: 'serialization_error_recovery',
                        error: 'Serialization error could not be recovered',
                        shouldRetry: false
                    };
                }
            },
            // Strategy 4: Generic Error Recovery
            {
                name: 'generic_error_recovery',
                priority: 10,
                canHandle: (error, context) => {
                    return true; // Can handle any error as last resort
                },
                recover: async (error, context) => {
                    // Try server state first
                    if (context.serverState) {
                        const validation = this.conflictResolver.validateState(context.serverState, context.gameId, context.userId);
                        if (validation.isValid || validation.canRecover) {
                            return {
                                success: true,
                                recoveredState: context.serverState,
                                fallbackApplied: true,
                                strategy: 'generic_error_recovery',
                                shouldRetry: false
                            };
                        }
                    }
                    // Try preserved state as last resort
                    if (context.preservedState) {
                        const validation = this.conflictResolver.validateState(context.preservedState, context.gameId, context.userId);
                        if (validation.isValid || validation.canRecover) {
                            return {
                                success: true,
                                recoveredState: context.preservedState,
                                fallbackApplied: true,
                                strategy: 'generic_error_recovery',
                                shouldRetry: false
                            };
                        }
                    }
                    return {
                        success: false,
                        fallbackApplied: false,
                        strategy: 'generic_error_recovery',
                        error: 'No recovery possible',
                        shouldRetry: false
                    };
                }
            }
        ];
    }
}
exports.ReconnectionErrorRecovery = ReconnectionErrorRecovery;
