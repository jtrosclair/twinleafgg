import { DisconnectedSession } from '../../storage/model/disconnected-session';
import { User } from '../../storage/model/user';
import { State } from '../../game/store/state/state';
import { SocketClient } from '../socket/socket-client';
import { Socket } from 'socket.io';
import { ReconnectionConfig, ReconnectionResult, ReconnectionStatus } from '../interfaces/reconnection.interface';
import { ReconnectionConfigManager } from './reconnection-config-manager';
import { ReconnectionCleanupService } from './reconnection-cleanup.service';
import { ReconnectionMaintenanceScheduler } from './reconnection-maintenance-scheduler';
import { ReconnectionConflictResolver, ConflictResolutionResult } from './reconnection-conflict-resolver';
import { ReconnectionErrorRecovery } from './reconnection-error-recovery';
export declare class ReconnectionManager {
    private configManager;
    private gameStatePreserver;
    private cleanupService;
    private maintenanceScheduler;
    private conflictResolver;
    private errorRecovery;
    private cleanupInterval;
    private resourceMetricsInterval;
    constructor(config: ReconnectionConfig);
    /**
     * Get current configuration
     */
    getCurrentConfig(): ReconnectionConfig;
    /**
     * Update configuration at runtime
     */
    updateConfig(partialConfig: Partial<ReconnectionConfig>): boolean;
    /**
     * Get configuration manager for advanced operations
     */
    getConfigManager(): ReconnectionConfigManager;
    /**
     * Handle player disconnection
     */
    handleDisconnection(client: SocketClient, reason: string): Promise<void>;
    /**
     * Handle player reconnection attempt
     */
    handleReconnection(user: User, socket: Socket): Promise<ReconnectionResult>;
    /**
     * Get reconnection status for a user
     */
    getReconnectionStatus(userId: number): Promise<ReconnectionStatus | null>;
    /**
     * Clean up expired disconnected sessions (delegated to cleanup service)
     */
    cleanupExpiredSessions(): Promise<void>;
    /**
     * Get all disconnected sessions for monitoring
     */
    getActiveDisconnectedSessions(): Promise<DisconnectedSession[]>;
    /**
     * Force cleanup of all sessions for a specific user (delegated to cleanup service)
     */
    cleanupUserSessions(userId: number): Promise<void>;
    /**
     * Create or update disconnected session record
     */
    private createDisconnectedSession;
    /**
     * Find active disconnected session for a user
     */
    private findActiveDisconnectedSession;
    /**
     * Check if it's the player's turn
     */
    private isPlayerTurn;
    /**
     * Check for sessions approaching timeout and send warnings
     */
    checkTimeoutWarnings(): Promise<void>;
    /**
     * Start the cleanup interval
     */
    private startCleanupInterval;
    /**
     * Handle configuration updates
     */
    private handleConfigUpdate;
    /**
     * Start resource metrics collection
     */
    private startResourceMetricsCollection;
    /**
     * Collect and update resource metrics
     */
    private collectAndUpdateResourceMetrics;
    /**
     * Get count of preserved sessions
     */
    private getPreservedSessionCount;
    /**
     * Get count of active sessions (placeholder - would need actual session tracking)
     */
    private getActiveSessionCount;
    /**
     * Restart cleanup interval with new configuration
     */
    private restartCleanupInterval;
    /**
     * Get differences between two configurations
     */
    private getConfigDifferences;
    /**
     * Get cleanup service for advanced cleanup operations
     */
    getCleanupService(): ReconnectionCleanupService;
    /**
     * Get maintenance scheduler for advanced maintenance operations
     */
    getMaintenanceScheduler(): ReconnectionMaintenanceScheduler;
    /**
     * Handle state conflicts during reconnection
     */
    handleStateConflicts(serverState: State, preservedState: State, gameId: number, userId: number): Promise<ConflictResolutionResult>;
    /**
     * Get conflict resolver for advanced conflict operations
     */
    getConflictResolver(): ReconnectionConflictResolver;
    /**
     * Get error recovery service for advanced error handling
     */
    getErrorRecovery(): ReconnectionErrorRecovery;
    /**
     * Dispose of the reconnection manager
     */
    dispose(): Promise<void>;
}
