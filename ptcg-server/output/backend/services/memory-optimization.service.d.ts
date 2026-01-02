export interface MemoryOptimizationConfig {
    enablePeriodicCleanup: boolean;
    cleanupIntervalMs: number;
    aggressiveCleanupThreshold: number;
    maxMemoryUsage: number;
    enableStateCompression: boolean;
    maxStateSize: number;
}
export declare class MemoryOptimizationService {
    private static instance;
    private memoryMonitor;
    private config;
    private optimizationInterval;
    private isRunning;
    private constructor();
    static getInstance(): MemoryOptimizationService;
    /**
     * Start memory optimization service
     */
    start(): void;
    /**
     * Stop memory optimization service
     */
    stop(): void;
    /**
     * Perform memory optimization
     */
    performOptimization(): Promise<void>;
    /**
     * Perform critical memory optimization
     */
    private performCriticalOptimization;
    /**
     * Perform aggressive memory optimization
     */
    private performAggressiveOptimization;
    /**
     * Perform preventive memory optimization
     */
    private performPreventiveOptimization;
    /**
     * Clear various caches and temporary data
     */
    private clearCaches;
    /**
     * Force cleanup of expired sessions
     */
    private forceCleanupExpiredSessions;
    /**
     * Get optimization status
     */
    getStatus(): {
        isRunning: boolean;
        config: MemoryOptimizationConfig;
        memoryHealth: any;
        lastOptimization: number;
    };
    /**
     * Update configuration
     */
    updateConfig(newConfig: Partial<MemoryOptimizationConfig>): void;
    /**
     * Get memory statistics
     */
    getMemoryStats(): {
        current: import("./memory-monitor.service").MemoryStats;
        history: import("./memory-monitor.service").MemoryStats[];
        trend: {
            isIncreasing: boolean;
            averageGrowth: number;
            peakUsage: number;
            recommendation: string;
        };
        health: {
            isHealthy: boolean;
            currentUsage: number;
            peakUsage: number;
            trend: string;
            recommendation: string;
        };
    };
    /**
     * Utility method for sleeping
     */
    private sleep;
}
