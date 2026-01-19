"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReconnectionManager = void 0;
const disconnected_session_1 = require("../../storage/model/disconnected-session");
const state_1 = require("../../game/store/state/state");
const logger_1 = require("../../utils/logger");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const game_state_preserver_1 = require("./game-state-preserver");
const reconnection_config_manager_1 = require("./reconnection-config-manager");
const reconnection_cleanup_service_1 = require("./reconnection-cleanup.service");
const reconnection_maintenance_scheduler_1 = require("./reconnection-maintenance-scheduler");
const reconnection_conflict_resolver_1 = require("./reconnection-conflict-resolver");
const reconnection_error_recovery_1 = require("./reconnection-error-recovery");
class ReconnectionManager {
    constructor(config) {
        this.cleanupInterval = null;
        this.resourceMetricsInterval = null;
        this.configManager = new reconnection_config_manager_1.ReconnectionConfigManager(config);
        this.gameStatePreserver = new game_state_preserver_1.GameStatePreserver({
            preservationTimeoutMs: config.preservationTimeoutMs,
            maxPreservedSessionsPerUser: config.maxPreservedSessionsPerUser,
            maxSerializedStateSize: 1024 * 1024,
            compressionEnabled: true
        });
        // Initialize cleanup service
        this.cleanupService = new reconnection_cleanup_service_1.ReconnectionCleanupService(this.gameStatePreserver, this.configManager, {
            cleanupIntervalMs: config.cleanupIntervalMs,
            databaseOptimizationIntervalMs: 300 * 60 * 1000,
            memoryCleanupThresholdMb: 1000,
            maxSessionAge: 1 * 60 * 60 * 1000,
            enableScheduledCleanup: true,
            enableDatabaseOptimization: true,
            enableMemoryManagement: true
        });
        // Initialize maintenance scheduler
        this.maintenanceScheduler = new reconnection_maintenance_scheduler_1.ReconnectionMaintenanceScheduler(this.cleanupService);
        this.maintenanceScheduler.start();
        // Initialize conflict resolution and error recovery
        this.conflictResolver = new reconnection_conflict_resolver_1.ReconnectionConflictResolver();
        this.errorRecovery = new reconnection_error_recovery_1.ReconnectionErrorRecovery();
        // Listen for configuration changes
        this.configManager.on('configUpdated', this.handleConfigUpdate.bind(this));
        // Start cleanup interval (legacy - now handled by cleanup service)
        this.startCleanupInterval();
        // Start resource metrics collection
        this.startResourceMetricsCollection();
    }
    /**
     * Get current configuration
     */
    getCurrentConfig() {
        return this.configManager.getCurrentConfig();
    }
    /**
     * Update configuration at runtime
     */
    updateConfig(partialConfig) {
        const result = this.configManager.updateConfig(partialConfig);
        return result.isValid;
    }
    /**
     * Get configuration manager for advanced operations
     */
    getConfigManager() {
        return this.configManager;
    }
    /**
     * Handle player disconnection
     */
    async handleDisconnection(client, reason) {
        const startTime = Date.now();
        const user = client.user;
        const sessionId = `${user.id}-${Date.now()}`;
        try {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.INFO,
                category: 'reconnection',
                message: 'Handling disconnection',
                userId: user.id,
                sessionId,
                data: {
                    reason,
                    gameCount: client.games.length,
                    games: client.games.map(g => ({ id: g.id, phase: g.state.phase.toString() }))
                }
            });
            const activeGame = client.games.find(game => game.state.phase !== state_1.GamePhase.FINISHED);
            if (!activeGame) {
                logger_1.logger.logStructured({
                    level: logger_1.LogLevel.INFO,
                    category: 'reconnection',
                    message: 'User disconnected but has no active game',
                    userId: user.id,
                    sessionId,
                    data: { reason }
                });
                return;
            }
            // Log the disconnection event
            logger_1.logger.logDisconnection(user.id, activeGame.id, reason, sessionId);
            // Get current game state
            const gameState = activeGame.state;
            // Preserve the game state
            await this.gameStatePreserver.preserveGameState(activeGame.id, user.id, gameState);
            // Create or update disconnected session record
            await this.createDisconnectedSession(user.id, activeGame.id, gameState, reason);
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.INFO,
                category: 'reconnection',
                message: 'Disconnected session created',
                userId: user.id,
                gameId: activeGame.id,
                sessionId,
                data: { reason }
            });
            const duration = Date.now() - startTime;
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.INFO,
                category: 'reconnection',
                message: 'Disconnection handled successfully',
                userId: user.id,
                gameId: activeGame.id,
                sessionId,
                data: {
                    reason,
                    processingTimeMs: duration,
                    gamePhase: gameState.phase.toString()
                }
            });
        }
        catch (error) {
            const duration = Date.now() - startTime;
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.ERROR,
                category: 'reconnection',
                message: 'Error handling disconnection',
                userId: user.id,
                sessionId,
                data: {
                    reason,
                    processingTimeMs: duration
                },
                error: error
            });
            throw new game_error_1.GameError(game_message_1.GameCoreError.ERROR_SERIALIZER, `Failed to handle disconnection for user ${client.user.id}: ${error}`);
        }
    }
    /**
     * Handle player reconnection attempt
     */
    async handleReconnection(user, socket) {
        const startTime = Date.now();
        const sessionId = `${user.id}-reconnect-${Date.now()}`;
        try {
            logger_1.logger.logReconnectionAttempt(user.id, 0, 1, sessionId);
            // Find active disconnected session for this user
            const disconnectedSession = await this.findActiveDisconnectedSession(user.id);
            if (!disconnectedSession) {
                logger_1.logger.logReconnectionFailure(user.id, 0, 'No active disconnected session found', sessionId);
                return {
                    success: false,
                    error: 'No active disconnected session found'
                };
            }
            // Check if session has expired
            if (Date.now() > disconnectedSession.expiresAt) {
                logger_1.logger.logSessionExpiry(user.id, disconnectedSession.gameId, sessionId);
                await disconnectedSession.remove();
                logger_1.logger.logReconnectionFailure(user.id, disconnectedSession.gameId, 'Reconnection session has expired', sessionId);
                return {
                    success: false,
                    error: 'Reconnection session has expired'
                };
            }
            // Retrieve preserved game state with error recovery
            let preservedState;
            try {
                preservedState = await this.gameStatePreserver.getPreservedState(disconnectedSession.gameId, user.id);
            }
            catch (error) {
                logger_1.logger.logStructured({
                    level: logger_1.LogLevel.WARN,
                    category: 'reconnection',
                    message: 'Error retrieving preserved state, attempting recovery',
                    userId: user.id,
                    gameId: disconnectedSession.gameId,
                    sessionId,
                    error: error
                });
                // Attempt error recovery
                const recoveryResult = await this.errorRecovery.recoverFromError(error, disconnectedSession.gameId, user.id, undefined, // No preserved state available
                undefined, // No server state available at this point
                1, 3);
                if (!recoveryResult.success) {
                    await disconnectedSession.remove();
                    logger_1.logger.logReconnectionFailure(user.id, disconnectedSession.gameId, `State recovery failed: ${recoveryResult.error}`, sessionId);
                    return {
                        success: false,
                        error: recoveryResult.error || 'Game state could not be recovered'
                    };
                }
                // Use recovered state if available
                if (recoveryResult.recoveredState) {
                    preservedState = {
                        gameId: disconnectedSession.gameId,
                        userId: user.id,
                        state: recoveryResult.recoveredState,
                        preservedAt: disconnectedSession.disconnectedAt,
                        lastActivity: disconnectedSession.disconnectedAt
                    };
                }
            }
            if (!preservedState) {
                logger_1.logger.logStateRestoration(user.id, disconnectedSession.gameId, false, sessionId, new Error('No preserved state found'));
                await disconnectedSession.remove();
                logger_1.logger.logReconnectionFailure(user.id, disconnectedSession.gameId, 'Game state could not be restored', sessionId);
                return {
                    success: false,
                    error: 'Game state could not be restored'
                };
            }
            // Validate reconnection preconditions
            const preconditionValidation = this.errorRecovery.validateReconnectionPreconditions(disconnectedSession.gameId, user.id, preservedState.state);
            if (!preconditionValidation.isValid && !preconditionValidation.canRecover) {
                logger_1.logger.logStructured({
                    level: logger_1.LogLevel.ERROR,
                    category: 'reconnection',
                    message: 'Reconnection preconditions failed',
                    userId: user.id,
                    gameId: disconnectedSession.gameId,
                    sessionId,
                    data: {
                        errors: preconditionValidation.errors,
                        warnings: preconditionValidation.warnings
                    }
                });
                await disconnectedSession.remove();
                await this.gameStatePreserver.removePreservedState(disconnectedSession.gameId, user.id);
                return {
                    success: false,
                    error: `Reconnection preconditions failed: ${preconditionValidation.errors.join(', ')}`
                };
            }
            // Validate the preserved state
            const stateValidation = this.conflictResolver.validateState(preservedState.state, disconnectedSession.gameId, user.id);
            if (!stateValidation.isValid && !stateValidation.canRecover) {
                logger_1.logger.logStructured({
                    level: logger_1.LogLevel.ERROR,
                    category: 'reconnection',
                    message: 'Preserved state validation failed',
                    userId: user.id,
                    gameId: disconnectedSession.gameId,
                    sessionId,
                    data: {
                        errors: stateValidation.errors,
                        warnings: stateValidation.warnings
                    }
                });
                // Attempt error recovery for invalid state
                const gameError = new game_error_1.GameError(game_message_1.GameCoreError.ERROR_SERIALIZER, `Invalid state: ${stateValidation.errors.join(', ')}`);
                const error = new Error(gameError.message);
                const recoveryResult = await this.errorRecovery.recoverFromError(error, disconnectedSession.gameId, user.id, preservedState.state, undefined, 1, 3);
                if (!recoveryResult.success) {
                    await disconnectedSession.remove();
                    await this.gameStatePreserver.removePreservedState(disconnectedSession.gameId, user.id);
                    return {
                        success: false,
                        error: recoveryResult.error || 'State validation failed and could not be recovered'
                    };
                }
                // Use recovered state
                if (recoveryResult.recoveredState) {
                    preservedState.state = recoveryResult.recoveredState;
                }
            }
            // Clean up the disconnected session
            await disconnectedSession.remove();
            await this.gameStatePreserver.removePreservedState(disconnectedSession.gameId, user.id);
            const reconnectionTime = Date.now() - disconnectedSession.disconnectedAt;
            logger_1.logger.logReconnectionSuccess(user.id, disconnectedSession.gameId, reconnectionTime, sessionId);
            logger_1.logger.logStateRestoration(user.id, disconnectedSession.gameId, true, sessionId);
            return {
                success: true,
                gameId: disconnectedSession.gameId,
                gameState: preservedState.state
            };
        }
        catch (error) {
            const duration = Date.now() - startTime;
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.ERROR,
                category: 'reconnection',
                message: 'Error handling reconnection',
                userId: user.id,
                sessionId,
                data: {
                    processingTimeMs: duration
                },
                error: error
            });
            // Attempt final error recovery
            try {
                const recoveryResult = await this.errorRecovery.recoverFromError(error, 0, // Unknown game ID
                user.id, undefined, undefined, 1, 1 // Only one attempt for final recovery
                );
                if (recoveryResult.success) {
                    return {
                        success: true,
                        gameId: 0,
                        gameState: recoveryResult.recoveredState
                    };
                }
            }
            catch (recoveryError) {
                logger_1.logger.logStructured({
                    level: logger_1.LogLevel.ERROR,
                    category: 'reconnection',
                    message: 'Final error recovery failed',
                    userId: user.id,
                    sessionId,
                    error: recoveryError
                });
            }
            return {
                success: false,
                error: `Reconnection failed: ${error}`
            };
        }
    }
    /**
     * Get reconnection status for a user
     */
    async getReconnectionStatus(userId) {
        try {
            const disconnectedSession = await this.findActiveDisconnectedSession(userId);
            if (!disconnectedSession) {
                return null;
            }
            // Check if session has expired
            if (Date.now() > disconnectedSession.expiresAt) {
                await disconnectedSession.remove();
                return null;
            }
            return {
                userId: disconnectedSession.userId,
                gameId: disconnectedSession.gameId,
                disconnectedAt: disconnectedSession.disconnectedAt,
                expiresAt: disconnectedSession.expiresAt,
                gamePhase: disconnectedSession.gamePhase,
                isPlayerTurn: disconnectedSession.isPlayerTurn
            };
        }
        catch (error) {
            logger_1.logger.log(`[ReconnectionManager] Error getting reconnection status: ${error}`);
            return null;
        }
    }
    /**
     * Clean up expired disconnected sessions (delegated to cleanup service)
     */
    async cleanupExpiredSessions() {
        await this.cleanupService.performScheduledCleanup();
    }
    /**
     * Get all disconnected sessions for monitoring
     */
    async getActiveDisconnectedSessions() {
        try {
            const now = Date.now();
            return await disconnected_session_1.DisconnectedSession.createQueryBuilder('session')
                .where('session.expiresAt > :now', { now })
                .getMany();
        }
        catch (error) {
            logger_1.logger.log(`[ReconnectionManager] Error getting active sessions: ${error}`);
            return [];
        }
    }
    /**
     * Force cleanup of all sessions for a specific user (delegated to cleanup service)
     */
    async cleanupUserSessions(userId) {
        await this.cleanupService.forceCleanupUserSessions(userId);
    }
    /**
     * Create or update disconnected session record
     */
    async createDisconnectedSession(userId, gameId, gameState, reason) {
        const now = Date.now();
        const expiresAt = now + this.getCurrentConfig().preservationTimeoutMs;
        try {
            // Check for existing session
            const existingSession = await disconnected_session_1.DisconnectedSession.findOne({
                where: { userId, gameId }
            });
            if (existingSession) {
                logger_1.logger.logStructured({
                    level: logger_1.LogLevel.INFO,
                    category: 'reconnection',
                    message: 'Updating existing disconnected session',
                    userId,
                    gameId,
                    data: { sessionId: existingSession.id, reason }
                });
                existingSession.disconnectedAt = now;
                existingSession.expiresAt = expiresAt;
                existingSession.gamePhase = gameState.phase.toString();
                existingSession.isPlayerTurn = this.isPlayerTurn(gameState, userId);
                existingSession.disconnectionReason = reason;
                await existingSession.save();
            }
            else {
                logger_1.logger.logStructured({
                    level: logger_1.LogLevel.INFO,
                    category: 'reconnection',
                    message: 'Creating new disconnected session',
                    userId,
                    gameId,
                    data: { reason, expiresAt }
                });
                const session = new disconnected_session_1.DisconnectedSession();
                session.userId = userId;
                session.gameId = gameId;
                session.gameState = ''; // This will be handled by GameStatePreserver
                session.disconnectedAt = now;
                session.expiresAt = expiresAt;
                session.gamePhase = gameState.phase.toString();
                session.isPlayerTurn = this.isPlayerTurn(gameState, userId);
                session.disconnectionReason = reason;
                await session.save();
                logger_1.logger.logStructured({
                    level: logger_1.LogLevel.INFO,
                    category: 'reconnection',
                    message: 'Disconnected session saved',
                    userId,
                    gameId,
                    data: { sessionId: session.id, reason }
                });
            }
        }
        catch (error) {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.ERROR,
                category: 'reconnection',
                message: 'Error creating disconnected session',
                userId,
                gameId,
                error: error
            });
            throw error;
        }
    }
    /**
     * Find active disconnected session for a user
     */
    async findActiveDisconnectedSession(userId) {
        const now = Date.now();
        const result = await disconnected_session_1.DisconnectedSession.createQueryBuilder('session')
            .where('session.userId = :userId', { userId })
            .andWhere('session.expiresAt > :now', { now })
            .orderBy('session.disconnectedAt', 'DESC')
            .getOne();
        return result || null;
    }
    /**
     * Check if it's the player's turn
     */
    isPlayerTurn(gameState, userId) {
        // This is a simplified implementation
        // In reality, you'd need to map the userId to the player index
        // based on the game's player mapping
        return gameState.activePlayer === 0; // Placeholder
    }
    /**
     * Check for sessions approaching timeout and send warnings
     */
    async checkTimeoutWarnings() {
        try {
            const now = Date.now();
            const warningThreshold = 60000; // 1 minute before timeout
            const approachingTimeoutSessions = await disconnected_session_1.DisconnectedSession.createQueryBuilder('session')
                .where('session.expiresAt > :now', { now })
                .andWhere('session.expiresAt <= :warningTime', { warningTime: now + warningThreshold })
                .getMany();
            for (const session of approachingTimeoutSessions) {
                const timeRemaining = Math.max(0, session.expiresAt - now);
                // Find the game and send warning to the disconnected player if they reconnect
                // This would be handled by the Core when the player reconnects
                logger_1.logger.log(`[ReconnectionManager] Session approaching timeout: userId=${session.userId} gameId=${session.gameId} timeRemaining=${timeRemaining}ms`);
            }
        }
        catch (error) {
            logger_1.logger.log(`[ReconnectionManager] Error checking timeout warnings: ${error}`);
        }
    }
    /**
     * Start the cleanup interval
     */
    startCleanupInterval() {
        this.cleanupInterval = setInterval(async () => {
            try {
                logger_1.logger.log('STARTING CLEANUP');
                await this.cleanupExpiredSessions();
                await this.checkTimeoutWarnings();
            }
            catch (ex) {
                logger_1.logger.log('[ReconnectionManager] OOPS WE COULDN"T DO THE THING');
            }
        }, this.getCurrentConfig().cleanupIntervalMs);
        logger_1.logger.log(`[ReconnectionManager] Started cleanup interval (${this.getCurrentConfig().cleanupIntervalMs}ms)`);
    }
    /**
     * Handle configuration updates
     */
    handleConfigUpdate(event) {
        logger_1.logger.logStructured({
            level: logger_1.LogLevel.INFO,
            category: 'reconnection',
            message: 'Configuration updated',
            data: {
                source: event.source,
                timestamp: event.timestamp,
                changes: this.getConfigDifferences(event.oldConfig, event.newConfig)
            }
        });
        // Update GameStatePreserver configuration
        this.gameStatePreserver.updateConfig({
            preservationTimeoutMs: event.newConfig.preservationTimeoutMs,
            maxPreservedSessionsPerUser: event.newConfig.maxPreservedSessionsPerUser
        });
        // Restart cleanup interval if the interval changed
        if (event.oldConfig.cleanupIntervalMs !== event.newConfig.cleanupIntervalMs) {
            this.restartCleanupInterval();
        }
    }
    /**
     * Start resource metrics collection
     */
    startResourceMetricsCollection() {
        this.resourceMetricsInterval = setInterval(async () => {
            try {
                logger_1.logger.log('STARTING METRICS');
                await this.collectAndUpdateResourceMetrics();
            }
            catch (ex) {
                logger_1.logger.log('COULDNT DO THE RECONNECTION THING');
            }
        }, 30 * 1000 // Collect metrics every 30 seconds
        );
        logger_1.logger.log('[ReconnectionManager] Started resource metrics collection');
    }
    /**
     * Collect and update resource metrics
     */
    async collectAndUpdateResourceMetrics() {
        try {
            const metrics = {
                preservedSessions: await this.getPreservedSessionCount(),
                activeSessions: await this.getActiveSessionCount(),
                // Note: Memory and CPU metrics would typically come from system monitoring
                // For now, we'll use placeholder values or skip them
                timestamp: Date.now()
            };
            this.configManager.updateResourceMetrics(metrics);
        }
        catch (error) {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.ERROR,
                category: 'reconnection',
                message: 'Error collecting resource metrics',
                data: { error: error instanceof Error ? error.message : String(error) }
            });
        }
    }
    /**
     * Get count of preserved sessions
     */
    async getPreservedSessionCount() {
        try {
            return await disconnected_session_1.DisconnectedSession.count();
        }
        catch (error) {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.ERROR,
                category: 'reconnection',
                message: 'Error getting preserved session count',
                data: { error: error instanceof Error ? error.message : String(error) }
            });
            return 0;
        }
    }
    /**
     * Get count of active sessions (placeholder - would need actual session tracking)
     */
    async getActiveSessionCount() {
        // This would typically come from the WebSocket server or session manager
        // For now, return a placeholder value
        return 0;
    }
    /**
     * Restart cleanup interval with new configuration
     */
    restartCleanupInterval() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        this.startCleanupInterval();
    }
    /**
     * Get differences between two configurations
     */
    getConfigDifferences(oldConfig, newConfig) {
        const differences = {};
        for (const key of Object.keys(newConfig)) {
            if (JSON.stringify(oldConfig[key]) !== JSON.stringify(newConfig[key])) {
                differences[key] = {
                    old: oldConfig[key],
                    new: newConfig[key]
                };
            }
        }
        return differences;
    }
    /**
     * Get cleanup service for advanced cleanup operations
     */
    getCleanupService() {
        return this.cleanupService;
    }
    /**
     * Get maintenance scheduler for advanced maintenance operations
     */
    getMaintenanceScheduler() {
        return this.maintenanceScheduler;
    }
    /**
     * Handle state conflicts during reconnection
     */
    async handleStateConflicts(serverState, preservedState, gameId, userId) {
        const sessionId = `state-conflict-${userId}-${gameId}-${Date.now()}`;
        try {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.INFO,
                category: 'conflict-resolution',
                message: 'Handling state conflicts',
                userId,
                gameId,
                sessionId,
                data: {
                    serverPhase: serverState.phase.toString(),
                    preservedPhase: preservedState.phase.toString()
                }
            });
            // Detect conflicts
            const conflicts = this.conflictResolver.detectConflicts(serverState, preservedState, gameId, userId);
            if (conflicts.length === 0) {
                logger_1.logger.logStructured({
                    level: logger_1.LogLevel.INFO,
                    category: 'conflict-resolution',
                    message: 'No conflicts detected',
                    userId,
                    gameId,
                    sessionId
                });
                return {
                    success: true,
                    resolvedState: serverState,
                    conflicts: [],
                    fallbackApplied: false
                };
            }
            // Resolve conflicts
            const resolution = this.conflictResolver.resolveConflicts(serverState, preservedState, conflicts, gameId, userId);
            logger_1.logger.logStructured({
                level: resolution.success ? logger_1.LogLevel.INFO : logger_1.LogLevel.ERROR,
                category: 'conflict-resolution',
                message: 'Conflict resolution completed',
                userId,
                gameId,
                sessionId,
                data: {
                    success: resolution.success,
                    conflictCount: conflicts.length,
                    fallbackApplied: resolution.fallbackApplied
                }
            });
            return resolution;
        }
        catch (error) {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.ERROR,
                category: 'conflict-resolution',
                message: 'Error handling state conflicts',
                userId,
                gameId,
                sessionId,
                error: error
            });
            // Return server state as fallback
            return {
                success: true,
                resolvedState: serverState,
                conflicts: [{
                        type: 'data_corruption',
                        description: `Conflict resolution failed: ${error}`,
                        serverState: {},
                        preservedState: {},
                        severity: 'critical',
                        resolvable: false
                    }],
                fallbackApplied: true
            };
        }
    }
    /**
     * Get conflict resolver for advanced conflict operations
     */
    getConflictResolver() {
        return this.conflictResolver;
    }
    /**
     * Get error recovery service for advanced error handling
     */
    getErrorRecovery() {
        return this.errorRecovery;
    }
    /**
     * Dispose of the reconnection manager
     */
    async dispose() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
        if (this.resourceMetricsInterval) {
            clearInterval(this.resourceMetricsInterval);
            this.resourceMetricsInterval = null;
        }
        // Stop maintenance scheduler
        this.maintenanceScheduler.stop();
        // Gracefully shutdown cleanup service
        await this.cleanupService.gracefulShutdown();
        this.configManager.dispose();
        logger_1.logger.log('[ReconnectionManager] Disposed');
    }
}
exports.ReconnectionManager = ReconnectionManager;
