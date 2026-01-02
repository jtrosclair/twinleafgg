"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../utils/logger");
const reconnection_manager_1 = require("./reconnection-manager");
describe('Reconnection System Logging', () => {
    let reconnectionManager;
    const defaultConfig = {
        preservationTimeoutMs: 300000,
        maxAutoReconnectAttempts: 3,
        reconnectIntervals: [5000, 10000, 15000],
        healthCheckIntervalMs: 30000,
        cleanupIntervalMs: 60000,
        maxPreservedSessionsPerUser: 1
    };
    beforeEach(() => {
        logger_1.logger.resetMetrics();
        reconnectionManager = new reconnection_manager_1.ReconnectionManager(defaultConfig);
    });
    afterEach(() => {
        reconnectionManager.dispose();
    });
    describe('Logger Functionality', () => {
        it('should log disconnection events correctly', () => {
            logger_1.logger.logDisconnection(123, 456, 'network_error', 'session-123');
            const metrics = logger_1.logger.getReconnectionMetrics();
            expect(metrics.totalDisconnections).toBe(1);
            const logs = logger_1.logger.getRecentLogs('reconnection');
            expect(logs.length).toBeGreaterThan(0);
            const disconnectionLog = logs.find(log => log.message === 'Player disconnected');
            expect(disconnectionLog).toBeDefined();
            expect(disconnectionLog === null || disconnectionLog === void 0 ? void 0 : disconnectionLog.userId).toBe(123);
            expect(disconnectionLog === null || disconnectionLog === void 0 ? void 0 : disconnectionLog.gameId).toBe(456);
        });
        it('should log reconnection attempts and track metrics', () => {
            logger_1.logger.logReconnectionAttempt(123, 456, 1, 'session-123');
            logger_1.logger.logReconnectionSuccess(123, 456, 2000, 'session-123');
            const metrics = logger_1.logger.getReconnectionMetrics();
            expect(metrics.totalReconnectionAttempts).toBe(1);
            expect(metrics.successfulReconnections).toBe(1);
            expect(metrics.averageReconnectionTime).toBe(2000);
            const logs = logger_1.logger.getRecentLogs('reconnection');
            expect(logs.length).toBeGreaterThan(0);
        });
        it('should log state preservation events', () => {
            logger_1.logger.logStatePreservation(123, 456, true, 'session-123');
            const metrics = logger_1.logger.getReconnectionMetrics();
            expect(metrics.preservedStatesCount).toBe(1);
            const logs = logger_1.logger.getRecentLogs('state-preservation');
            expect(logs.length).toBeGreaterThan(0);
            const preservationLog = logs.find(log => log.message === 'Game state preserved successfully');
            expect(preservationLog).toBeDefined();
        });
        it('should log errors and track error count', () => {
            const error = new Error('Test error');
            logger_1.logger.logReconnectionFailure(123, 456, 'timeout', 'session-123', error);
            const metrics = logger_1.logger.getReconnectionMetrics();
            expect(metrics.failedReconnections).toBe(1);
            expect(metrics.errorCount).toBe(1);
            const errorLogs = logger_1.logger.getRecentLogs(undefined, logger_1.LogLevel.ERROR);
            expect(errorLogs.length).toBeGreaterThan(0);
            const errorLog = errorLogs.find(log => log.message === 'Reconnection failed');
            expect(errorLog).toBeDefined();
            expect(errorLog === null || errorLog === void 0 ? void 0 : errorLog.error).toBe(error);
        });
        it('should log cleanup operations', () => {
            logger_1.logger.logCleanupOperation('expired-sessions', 5, 1500);
            const metrics = logger_1.logger.getReconnectionMetrics();
            expect(metrics.cleanupOperations).toBe(1);
            const logs = logger_1.logger.getRecentLogs('cleanup');
            expect(logs.length).toBeGreaterThan(0);
            const cleanupLog = logs.find(log => log.message.includes('Cleanup operation completed'));
            expect(cleanupLog).toBeDefined();
            expect(cleanupLog === null || cleanupLog === void 0 ? void 0 : cleanupLog.data.itemsProcessed).toBe(5);
            expect(cleanupLog === null || cleanupLog === void 0 ? void 0 : cleanupLog.data.durationMs).toBe(1500);
        });
        it('should filter logs by category', () => {
            logger_1.logger.logDisconnection(123, 456, 'network_error');
            logger_1.logger.logStatePreservation(123, 456, true);
            logger_1.logger.logCleanupOperation('test', 1, 100);
            const reconnectionLogs = logger_1.logger.getRecentLogs('reconnection');
            const preservationLogs = logger_1.logger.getRecentLogs('state-preservation');
            const cleanupLogs = logger_1.logger.getRecentLogs('cleanup');
            expect(reconnectionLogs.length).toBeGreaterThan(0);
            expect(preservationLogs.length).toBeGreaterThan(0);
            expect(cleanupLogs.length).toBeGreaterThan(0);
            // Verify category filtering
            for (const log of reconnectionLogs) {
                expect(log.category).toBe('reconnection');
            }
        });
        it('should filter logs by level', () => {
            logger_1.logger.logDisconnection(123, 456, 'network_error'); // INFO level
            logger_1.logger.logReconnectionFailure(124, 457, 'error'); // ERROR level
            const allLogs = logger_1.logger.getRecentLogs();
            const errorLogs = logger_1.logger.getRecentLogs(undefined, logger_1.LogLevel.ERROR);
            expect(allLogs.length).toBeGreaterThan(errorLogs.length);
            for (const log of errorLogs) {
                expect(log.level).toBeGreaterThanOrEqual(logger_1.LogLevel.ERROR);
            }
        });
        it('should export logs for time range', () => {
            const startTime = Date.now() - 1000;
            logger_1.logger.logDisconnection(123, 456, 'network_error');
            const endTime = Date.now() + 1000;
            const logs = logger_1.logger.exportLogs(undefined, startTime, endTime);
            expect(logs.length).toBeGreaterThan(0);
            for (const log of logs) {
                expect(log.timestamp).toBeGreaterThanOrEqual(startTime);
                expect(log.timestamp).toBeLessThanOrEqual(endTime);
            }
        });
        it('should calculate average reconnection time correctly', () => {
            logger_1.logger.logReconnectionSuccess(123, 456, 1000);
            logger_1.logger.logReconnectionSuccess(124, 457, 2000);
            logger_1.logger.logReconnectionSuccess(125, 458, 3000);
            const metrics = logger_1.logger.getReconnectionMetrics();
            expect(metrics.averageReconnectionTime).toBe(2000);
        });
        it('should reset metrics correctly', () => {
            logger_1.logger.logDisconnection(123, 456, 'network_error');
            logger_1.logger.logReconnectionSuccess(123, 456, 1000);
            const beforeReset = logger_1.logger.getReconnectionMetrics();
            expect(beforeReset.totalDisconnections).toBe(1);
            expect(beforeReset.successfulReconnections).toBe(1);
            logger_1.logger.resetMetrics();
            const afterReset = logger_1.logger.getReconnectionMetrics();
            expect(afterReset.totalDisconnections).toBe(0);
            expect(afterReset.successfulReconnections).toBe(0);
            expect(afterReset.lastResetTime).toBeGreaterThan(beforeReset.lastResetTime);
        });
        it('should maintain log buffer with size limit', () => {
            // Create more logs than the buffer size (1000)
            for (let i = 0; i < 1100; i++) {
                logger_1.logger.logStructured({ message: `Message ${i}` });
            }
            const allLogs = logger_1.logger.getRecentLogs();
            expect(allLogs.length).toBe(1000);
            // Should contain the most recent logs
            expect(allLogs[0].message).toBe('Message 1099');
        });
        it('should get log summary by category and level', () => {
            logger_1.logger.logDisconnection(123, 456, 'network_error');
            logger_1.logger.logReconnectionFailure(124, 457, 'timeout');
            logger_1.logger.logStatePreservation(125, 458, true);
            const summary = logger_1.logger.getLogSummary();
            expect(summary.reconnection).toBeDefined();
            expect(summary['state-preservation']).toBeDefined();
            expect(summary.reconnection.INFO).toBeGreaterThan(0);
            expect(summary.reconnection.ERROR).toBeGreaterThan(0);
        });
    });
    describe('Structured Logging', () => {
        it('should log structured entries with all fields', () => {
            const entry = {
                level: logger_1.LogLevel.INFO,
                category: 'test',
                message: 'Test message',
                userId: 123,
                gameId: 456,
                sessionId: 'session-123',
                data: { key: 'value' }
            };
            logger_1.logger.logStructured(entry);
            const logs = logger_1.logger.getRecentLogs('test');
            expect(logs.length).toBe(1);
            const log = logs[0];
            expect(log.message).toBe('Test message');
            expect(log.userId).toBe(123);
            expect(log.gameId).toBe(456);
            expect(log.sessionId).toBe('session-123');
            expect(log.data).toEqual({ key: 'value' });
        });
        it('should apply default values for missing fields', () => {
            logger_1.logger.logStructured({ message: 'Test' });
            const logs = logger_1.logger.getRecentLogs();
            expect(logs.length).toBe(1);
            const log = logs[0];
            expect(log.level).toBe(logger_1.LogLevel.INFO);
            expect(log.category).toBe('general');
            expect(log.timestamp).toBeDefined();
        });
        it('should handle logs with errors', () => {
            const error = new Error('Test error');
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.ERROR,
                category: 'test',
                message: 'Error occurred',
                error
            });
            const logs = logger_1.logger.getRecentLogs('test', logger_1.LogLevel.ERROR);
            expect(logs.length).toBe(1);
            expect(logs[0].error).toBe(error);
        });
    });
    describe('Connection Quality Logging', () => {
        it('should log connection quality changes', () => {
            const metrics = { averageLatency: 150, packetLoss: 0.02 };
            logger_1.logger.logConnectionQualityChange(123, 'excellent', 'good', metrics);
            const logs = logger_1.logger.getRecentLogs('connection-monitor');
            expect(logs.length).toBe(1);
            const log = logs[0];
            expect(log.message).toBe('Connection quality changed');
            expect(log.userId).toBe(123);
            expect(log.data.previousQuality).toBe('excellent');
            expect(log.data.currentQuality).toBe('good');
            expect(log.data.metrics).toEqual(metrics);
        });
        it('should log automatic reconnection attempts', () => {
            logger_1.logger.logAutomaticReconnectionAttempt(123, 2, 3, 10000);
            const logs = logger_1.logger.getRecentLogs('auto-reconnection');
            expect(logs.length).toBe(1);
            const log = logs[0];
            expect(log.message).toBe('Automatic reconnection attempt');
            expect(log.userId).toBe(123);
            expect(log.data.attemptNumber).toBe(2);
            expect(log.data.maxAttempts).toBe(3);
            expect(log.data.nextAttemptIn).toBe(10000);
        });
    });
    describe('Session Management Logging', () => {
        it('should log session expiry events', () => {
            logger_1.logger.logSessionExpiry(123, 456, 'session-123');
            const metrics = logger_1.logger.getReconnectionMetrics();
            expect(metrics.expiredSessions).toBe(1);
            const logs = logger_1.logger.getRecentLogs('session-management');
            expect(logs.length).toBe(1);
            const log = logs[0];
            expect(log.level).toBe(logger_1.LogLevel.WARN);
            expect(log.message).toBe('Disconnected session expired');
            expect(log.userId).toBe(123);
            expect(log.gameId).toBe(456);
        });
    });
    describe('Performance Tracking', () => {
        it('should track processing times in logs', () => {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.INFO,
                category: 'performance',
                message: 'Operation completed',
                data: { processingTimeMs: 150 }
            });
            const logs = logger_1.logger.getRecentLogs('performance');
            expect(logs.length).toBe(1);
            expect(logs[0].data.processingTimeMs).toBe(150);
        });
        it('should maintain reconnection time history for averages', () => {
            // Add multiple reconnection times
            for (let i = 1; i <= 5; i++) {
                logger_1.logger.logReconnectionSuccess(i, i, i * 1000);
            }
            const metrics = logger_1.logger.getReconnectionMetrics();
            expect(metrics.successfulReconnections).toBe(5);
            expect(metrics.averageReconnectionTime).toBe(3000); // Average of 1000, 2000, 3000, 4000, 5000
        });
    });
});
