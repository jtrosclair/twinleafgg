export interface MemoryStats {
    heapUsed: number;
    heapTotal: number;
    rss: number;
    external: number;
    arrayBuffers: number;
    heapUsedMb: number;
    rssMb: number;
    externalMb: number;
    timestamp: number;
}
export interface MemoryAlert {
    level: 'info' | 'warning' | 'critical';
    message: string;
    data: MemoryStats;
    timestamp: number;
}
export declare class MemoryMonitorService {
    private static instance;
    private monitoringInterval;
    private isMonitoring;
    private memoryHistory;
    private maxHistorySize;
    private alertThresholds;
    static getInstance(): MemoryMonitorService;
    /**
     * Start memory monitoring
     */
    startMonitoring(intervalMs?: number): void;
    /**
     * Stop memory monitoring
     */
    stopMonitoring(): void;
    /**
     * Collect current memory statistics
     */
    collectMemoryStats(): MemoryStats;
    /**
     * Get current memory statistics
     */
    getCurrentMemoryStats(): MemoryStats;
    /**
     * Get memory history
     */
    getMemoryHistory(): MemoryStats[];
    /**
     * Get memory trend analysis
     */
    getMemoryTrend(): {
        isIncreasing: boolean;
        averageGrowth: number;
        peakUsage: number;
        recommendation: string;
    };
    /**
     * Check for memory alerts
     */
    private checkMemoryAlerts;
    /**
     * Force garbage collection and return memory freed
     */
    forceGarbageCollection(): number;
    /**
     * Get memory health status
     */
    getHealthStatus(): {
        isHealthy: boolean;
        currentUsage: number;
        peakUsage: number;
        trend: string;
        recommendation: string;
    };
    /**
     * Update alert thresholds
     */
    updateThresholds(warning: number, critical: number): void;
    /**
     * Clear memory history
     */
    clearHistory(): void;
}
