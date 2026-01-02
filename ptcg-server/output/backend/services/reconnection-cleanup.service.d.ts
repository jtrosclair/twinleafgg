import { GameStatePreserver } from './game-state-preserver';
import { ReconnectionConfigManager } from './reconnection-config-manager';
export interface CleanupMetrics {
    expiredSessionsRemoved: number;
    orphanedStatesRemoved: number;
    databaseOptimizationTime: number;
    memoryFreed: number;
    lastCleanupTime: number;
    totalCleanupOperations: number;
}
export interface MaintenanceConfig {
    cleanupIntervalMs: number;
    databaseOptimizationIntervalMs: number;
    memoryCleanupThresholdMb: number;
    maxSessionAge: number;
    enableScheduledCleanup: boolean;
    enableDatabaseOptimization: boolean;
    enableMemoryManagement: boolean;
}
export declare class ReconnectionCleanupService {
    private gameStatePreserver;
    private scheduler;
    private cleanupInterval;
    private maintenanceInterval;
    private isShuttingDown;
    private activeCleanupPromises;
    private metrics;
    private config;
    constructor(gameStatePreserver: GameStatePreserver, configManager: ReconnectionConfigManager, maintenanceConfig?: Partial<MaintenanceConfig>);
    /**
     * Start scheduled cleanup and maintenance tasks
     */
    private startScheduledTasks;
    /**
     * Start cleanup interval for expired sessions
     */
    private startCleanupInterval;
    /**
     * Start maintenance interval for database optimization
     */
    private startMaintenanceInterval;
    /**
     * Perform scheduled cleanup of expired sessions
     */
    performScheduledCleanup(): Promise<void>;
    /**
     * Clean up expired disconnected sessions
     */
    cleanupExpiredSessions(): Promise<number>;
    /**
     * Clean up orphaned game states (states without corresponding sessions)
     */
    cleanupOrphanedGameStates(): Promise<number>;
    /**
     * Perform memory cleanup if memory usage exceeds threshold
     */
    performMemoryCleanup(): Promise<number>;
    /**
     * Perform aggressive memory cleanup operations
     */
    private performAggressiveCleanup;
    /**
     * Perform database maintenance tasks
     */
    performDatabaseMaintenance(): Promise<void>;
    /**
     * Clean up sessions older than max age
     */
    private cleanupOldSessions;
    /**
     * Optimize reconnection-related database tables
     */
    private optimizeSessionTable;
    /**
     * Perform daily maintenance tasks
     */
    private performDailyMaintenance;
    /**
     * Graceful shutdown handling for preserved sessions
     */
    gracefulShutdown(): Promise<void>;
    /**
     * Force cleanup of all sessions for a specific user
     */
    forceCleanupUserSessions(userId: number): Promise<number>;
    /**
     * Get cleanup metrics
     */
    getMetrics(): CleanupMetrics;
    /**
     * Reset cleanup metrics
     */
    resetMetrics(): void;
    /**
     * Update maintenance configuration
     */
    updateConfig(newConfig: Partial<MaintenanceConfig>): void;
    /**
     * Get current configuration
     */
    getConfig(): MaintenanceConfig;
    /**
     * Get health status of the cleanup service
     */
    getHealthStatus(): {
        isHealthy: boolean;
        lastCleanupAge: number;
        activeOperations: number;
        isShuttingDown: boolean;
        metrics: CleanupMetrics;
    };
}
