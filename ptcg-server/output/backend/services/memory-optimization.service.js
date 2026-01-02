"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryOptimizationService = void 0;
const logger_1 = require("../../utils/logger");
const memory_monitor_service_1 = require("./memory-monitor.service");
class MemoryOptimizationService {
    constructor() {
        this.optimizationInterval = null;
        this.isRunning = false;
        this.memoryMonitor = memory_monitor_service_1.MemoryMonitorService.getInstance();
        this.config = {
            enablePeriodicCleanup: true,
            cleanupIntervalMs: 60000,
            aggressiveCleanupThreshold: 400,
            maxMemoryUsage: 800,
            enableStateCompression: true,
            maxStateSize: 1024 * 1024 // 1MB
        };
    }
    static getInstance() {
        if (!MemoryOptimizationService.instance) {
            MemoryOptimizationService.instance = new MemoryOptimizationService();
        }
        return MemoryOptimizationService.instance;
    }
    /**
     * Start memory optimization service
     */
    start() {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        this.memoryMonitor.startMonitoring(30000); // Monitor every 30 seconds
        if (this.config.enablePeriodicCleanup) {
            this.optimizationInterval = setInterval(() => {
                this.performOptimization();
            }, this.config.cleanupIntervalMs);
        }
        logger_1.logger.logStructured({
            level: logger_1.LogLevel.INFO,
            category: 'memory-optimization',
            message: 'Memory optimization service started',
            data: { config: this.config }
        });
    }
    /**
     * Stop memory optimization service
     */
    stop() {
        if (this.optimizationInterval) {
            clearInterval(this.optimizationInterval);
            this.optimizationInterval = null;
        }
        this.memoryMonitor.stopMonitoring();
        this.isRunning = false;
        logger_1.logger.logStructured({
            level: logger_1.LogLevel.INFO,
            category: 'memory-optimization',
            message: 'Memory optimization service stopped'
        });
    }
    /**
     * Perform memory optimization
     */
    async performOptimization() {
        const startTime = Date.now();
        try {
            const memoryStats = this.memoryMonitor.getCurrentMemoryStats();
            const trend = this.memoryMonitor.getMemoryTrend();
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.DEBUG,
                category: 'memory-optimization',
                message: 'Starting memory optimization',
                data: {
                    heapUsedMb: memoryStats.heapUsedMb,
                    rssMb: memoryStats.rssMb,
                    trend: trend.isIncreasing ? 'increasing' : 'stable'
                }
            });
            // Perform different levels of optimization based on memory usage
            if (memoryStats.heapUsedMb > this.config.maxMemoryUsage) {
                await this.performCriticalOptimization();
            }
            else if (memoryStats.heapUsedMb > this.config.aggressiveCleanupThreshold) {
                await this.performAggressiveOptimization();
            }
            else if (trend.isIncreasing) {
                await this.performPreventiveOptimization();
            }
            const duration = Date.now() - startTime;
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.DEBUG,
                category: 'memory-optimization',
                message: 'Memory optimization completed',
                data: { durationMs: duration }
            });
        }
        catch (error) {
            const duration = Date.now() - startTime;
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.ERROR,
                category: 'memory-optimization',
                message: 'Error during memory optimization',
                data: { durationMs: duration },
                error: error
            });
        }
    }
    /**
     * Perform critical memory optimization
     */
    async performCriticalOptimization() {
        logger_1.logger.logStructured({
            level: logger_1.LogLevel.WARN,
            category: 'memory-optimization',
            message: 'Performing critical memory optimization'
        });
        // Force garbage collection multiple times
        for (let i = 0; i < 3; i++) {
            this.memoryMonitor.forceGarbageCollection();
            await this.sleep(1000); // Wait 1 second between GC calls
        }
        // Clear caches and temporary data
        await this.clearCaches();
        // Force cleanup of expired sessions
        await this.forceCleanupExpiredSessions();
        logger_1.logger.logStructured({
            level: logger_1.LogLevel.INFO,
            category: 'memory-optimization',
            message: 'Critical memory optimization completed'
        });
    }
    /**
     * Perform aggressive memory optimization
     */
    async performAggressiveOptimization() {
        logger_1.logger.logStructured({
            level: logger_1.LogLevel.INFO,
            category: 'memory-optimization',
            message: 'Performing aggressive memory optimization'
        });
        // Force garbage collection
        this.memoryMonitor.forceGarbageCollection();
        // Clear caches
        await this.clearCaches();
        logger_1.logger.logStructured({
            level: logger_1.LogLevel.INFO,
            category: 'memory-optimization',
            message: 'Aggressive memory optimization completed'
        });
    }
    /**
     * Perform preventive memory optimization
     */
    async performPreventiveOptimization() {
        logger_1.logger.logStructured({
            level: logger_1.LogLevel.DEBUG,
            category: 'memory-optimization',
            message: 'Performing preventive memory optimization'
        });
        // Light garbage collection
        this.memoryMonitor.forceGarbageCollection();
        logger_1.logger.logStructured({
            level: logger_1.LogLevel.DEBUG,
            category: 'memory-optimization',
            message: 'Preventive memory optimization completed'
        });
    }
    /**
     * Clear various caches and temporary data
     */
    async clearCaches() {
        try {
            // Clear require cache for non-essential modules
            const cacheKeys = Object.keys(require.cache);
            const nonEssentialModules = cacheKeys.filter(key => key.includes('node_modules') &&
                !key.includes('core') &&
                !key.includes('essential'));
            nonEssentialModules.forEach(key => {
                delete require.cache[key];
            });
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.DEBUG,
                category: 'memory-optimization',
                message: 'Cleared require cache',
                data: { clearedModules: nonEssentialModules.length }
            });
        }
        catch (error) {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.WARN,
                category: 'memory-optimization',
                message: 'Error clearing caches',
                error: error
            });
        }
    }
    /**
     * Force cleanup of expired sessions
     */
    async forceCleanupExpiredSessions() {
        try {
            // This would integrate with the existing cleanup service
            // For now, we'll just log the action
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.DEBUG,
                category: 'memory-optimization',
                message: 'Forcing cleanup of expired sessions'
            });
            // TODO: Integrate with ReconnectionCleanupService
            // await this.cleanupService.performScheduledCleanup();
        }
        catch (error) {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.WARN,
                category: 'memory-optimization',
                message: 'Error during forced session cleanup',
                error: error
            });
        }
    }
    /**
     * Get optimization status
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            config: this.config,
            memoryHealth: this.memoryMonitor.getHealthStatus(),
            lastOptimization: Date.now()
        };
    }
    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        this.config = Object.assign(Object.assign({}, this.config), newConfig);
        logger_1.logger.logStructured({
            level: logger_1.LogLevel.INFO,
            category: 'memory-optimization',
            message: 'Memory optimization configuration updated',
            data: { newConfig: this.config }
        });
        // Restart if running
        if (this.isRunning) {
            this.stop();
            this.start();
        }
    }
    /**
     * Get memory statistics
     */
    getMemoryStats() {
        return {
            current: this.memoryMonitor.getCurrentMemoryStats(),
            history: this.memoryMonitor.getMemoryHistory(),
            trend: this.memoryMonitor.getMemoryTrend(),
            health: this.memoryMonitor.getHealthStatus()
        };
    }
    /**
     * Utility method for sleeping
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.MemoryOptimizationService = MemoryOptimizationService;
