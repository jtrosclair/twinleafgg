"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReconnectionMonitoringService = void 0;
const logger_1 = require("../../utils/logger");
class ReconnectionMonitoringService {
    constructor(reconnectionManager, connectionMonitor) {
        this.metricsUpdateInterval = null;
        this.currentMetrics = null;
        this.reconnectionManager = reconnectionManager;
        this.connectionMonitor = connectionMonitor;
        this.startTime = Date.now();
        // Start periodic metrics collection
        this.startMetricsCollection();
    }
    /**
     * Get current system health metrics
     */
    async getSystemHealthMetrics() {
        const reconnectionMetrics = logger_1.logger.getReconnectionMetrics();
        const activeConnections = this.connectionMonitor.getMonitoredConnections().length;
        const activeDisconnectedSessions = await this.getActiveDisconnectedSessionsCount();
        const metrics = {
            reconnectionSystem: reconnectionMetrics,
            activeConnections,
            activeDisconnectedSessions,
            systemUptime: Date.now() - this.startTime,
            memoryUsage: process.memoryUsage(),
            lastUpdated: Date.now()
        };
        this.currentMetrics = metrics;
        return metrics;
    }
    /**
     * Get detailed metrics including performance and error information
     */
    async getDetailedMetrics() {
        const systemHealth = await this.getSystemHealthMetrics();
        const connectionQualityDistribution = this.getConnectionQualityDistribution();
        const recentErrors = logger_1.logger.getRecentLogs(undefined, logger_1.LogLevel.ERROR, 50);
        const performanceMetrics = this.calculatePerformanceMetrics();
        return {
            systemHealth,
            connectionQualityDistribution,
            recentErrors,
            performanceMetrics
        };
    }
    /**
     * Get metrics for a specific time range
     */
    getMetricsForTimeRange(startTime, endTime) {
        return logger_1.logger.exportLogs(undefined, startTime, endTime);
    }
    /**
     * Get metrics for a specific category
     */
    getMetricsByCategory(category, limit = 100) {
        return logger_1.logger.getRecentLogs(category, undefined, limit);
    }
    /**
     * Get error summary by category
     */
    getErrorSummary() {
        return logger_1.logger.getLogSummary();
    }
    /**
     * Get reconnection success rate
     */
    getReconnectionSuccessRate() {
        const metrics = logger_1.logger.getReconnectionMetrics();
        if (metrics.totalReconnectionAttempts === 0) {
            return 0;
        }
        return (metrics.successfulReconnections / metrics.totalReconnectionAttempts) * 100;
    }
    /**
     * Get system alerts based on current metrics
     */
    async getSystemAlerts() {
        const alerts = [];
        const metrics = await this.getSystemHealthMetrics();
        const successRate = this.getReconnectionSuccessRate();
        // Check reconnection success rate
        if (successRate < 80 && metrics.reconnectionSystem.totalReconnectionAttempts > 10) {
            alerts.push({
                level: 'warning',
                category: 'reconnection-performance',
                message: `Low reconnection success rate: ${successRate.toFixed(1)}%`,
                data: { successRate, attempts: metrics.reconnectionSystem.totalReconnectionAttempts }
            });
        }
        // Check error rate
        if (metrics.reconnectionSystem.errorCount > 50) {
            alerts.push({
                level: 'error',
                category: 'error-rate',
                message: `High error count: ${metrics.reconnectionSystem.errorCount}`,
                data: { errorCount: metrics.reconnectionSystem.errorCount }
            });
        }
        // Check memory usage
        const memoryUsageMB = metrics.memoryUsage.heapUsed / 1024 / 1024;
        if (memoryUsageMB > 500) { // Alert if using more than 500MB
            alerts.push({
                level: 'warning',
                category: 'memory-usage',
                message: `High memory usage: ${memoryUsageMB.toFixed(1)}MB`,
                data: { memoryUsageMB }
            });
        }
        // Check for expired sessions
        if (metrics.reconnectionSystem.expiredSessions > 100) {
            alerts.push({
                level: 'info',
                category: 'expired-sessions',
                message: `High number of expired sessions: ${metrics.reconnectionSystem.expiredSessions}`,
                data: { expiredSessions: metrics.reconnectionSystem.expiredSessions }
            });
        }
        return alerts;
    }
    /**
     * Reset all metrics
     */
    resetMetrics() {
        logger_1.logger.resetMetrics();
        this.startTime = Date.now();
        logger_1.logger.logStructured({
            level: logger_1.LogLevel.INFO,
            category: 'monitoring',
            message: 'Metrics reset by administrator',
            data: { resetTime: Date.now() }
        });
    }
    /**
     * Export metrics to JSON format
     */
    async exportMetrics(format = 'json') {
        const detailedMetrics = await this.getDetailedMetrics();
        if (format === 'json') {
            return JSON.stringify(detailedMetrics, null, 2);
        }
        else {
            // Simple CSV export for basic metrics
            const metrics = detailedMetrics.systemHealth.reconnectionSystem;
            const csvData = [
                'Metric,Value',
                `Total Disconnections,${metrics.totalDisconnections}`,
                `Total Reconnection Attempts,${metrics.totalReconnectionAttempts}`,
                `Successful Reconnections,${metrics.successfulReconnections}`,
                `Failed Reconnections,${metrics.failedReconnections}`,
                `Average Reconnection Time,${metrics.averageReconnectionTime}`,
                `Expired Sessions,${metrics.expiredSessions}`,
                `Preserved States,${metrics.preservedStatesCount}`,
                `Error Count,${metrics.errorCount}`,
                `Success Rate,${this.getReconnectionSuccessRate().toFixed(2)}%`
            ];
            return csvData.join('\n');
        }
    }
    /**
     * Start periodic metrics collection
     */
    startMetricsCollection() {
        this.metricsUpdateInterval = setInterval(async () => {
            var _a, _b;
            try {
                await this.getSystemHealthMetrics();
                // Log periodic health check
                logger_1.logger.logStructured({
                    level: logger_1.LogLevel.DEBUG,
                    category: 'monitoring',
                    message: 'Periodic health check completed',
                    data: {
                        timestamp: Date.now(),
                        activeConnections: (_a = this.currentMetrics) === null || _a === void 0 ? void 0 : _a.activeConnections,
                        activeDisconnectedSessions: (_b = this.currentMetrics) === null || _b === void 0 ? void 0 : _b.activeDisconnectedSessions
                    }
                });
            }
            catch (error) {
                logger_1.logger.logStructured({
                    level: logger_1.LogLevel.ERROR,
                    category: 'monitoring',
                    message: 'Error during periodic metrics collection',
                    error: error
                });
            }
        }, 60000); // Update every minute
    }
    /**
     * Stop metrics collection
     */
    dispose() {
        if (this.metricsUpdateInterval) {
            clearInterval(this.metricsUpdateInterval);
            this.metricsUpdateInterval = null;
        }
        logger_1.logger.logStructured({
            level: logger_1.LogLevel.INFO,
            category: 'monitoring',
            message: 'Monitoring service disposed',
            data: { uptime: Date.now() - this.startTime }
        });
    }
    /**
     * Get count of active disconnected sessions
     */
    async getActiveDisconnectedSessionsCount() {
        try {
            const sessions = await this.reconnectionManager.getActiveDisconnectedSessions();
            return sessions.length;
        }
        catch (error) {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.ERROR,
                category: 'monitoring',
                message: 'Error getting active disconnected sessions count',
                error: error
            });
            return 0;
        }
    }
    /**
     * Get connection quality distribution
     */
    getConnectionQualityDistribution() {
        const connections = this.connectionMonitor.getMonitoredConnections();
        const distribution = {
            excellent: 0,
            good: 0,
            poor: 0,
            unstable: 0
        };
        for (const connection of connections) {
            distribution[connection.connectionQuality]++;
        }
        return distribution;
    }
    /**
     * Calculate performance metrics from recent logs
     */
    calculatePerformanceMetrics() {
        var _a;
        const recentLogs = logger_1.logger.getRecentLogs(undefined, undefined, 1000);
        // Extract timing data from logs
        const disconnectionTimes = [];
        const reconnectionTimes = [];
        const preservationTimes = [];
        const restorationTimes = [];
        for (const log of recentLogs) {
            if ((_a = log.data) === null || _a === void 0 ? void 0 : _a.processingTimeMs) {
                switch (log.category) {
                    case 'reconnection':
                        if (log.message.includes('Disconnection handled')) {
                            disconnectionTimes.push(log.data.processingTimeMs);
                        }
                        else if (log.message.includes('reconnection')) {
                            reconnectionTimes.push(log.data.processingTimeMs);
                        }
                        break;
                    case 'state-preservation':
                        preservationTimes.push(log.data.processingTimeMs);
                        break;
                    case 'state-restoration':
                        restorationTimes.push(log.data.processingTimeMs);
                        break;
                }
            }
        }
        return {
            averageDisconnectionHandlingTime: this.calculateAverage(disconnectionTimes),
            averageReconnectionTime: this.calculateAverage(reconnectionTimes),
            averageStatePreservationTime: this.calculateAverage(preservationTimes),
            averageStateRestorationTime: this.calculateAverage(restorationTimes)
        };
    }
    /**
     * Calculate average of an array of numbers
     */
    calculateAverage(numbers) {
        if (numbers.length === 0)
            return 0;
        const sum = numbers.reduce((acc, num) => acc + num, 0);
        return Math.round(sum / numbers.length);
    }
}
exports.ReconnectionMonitoringService = ReconnectionMonitoringService;
