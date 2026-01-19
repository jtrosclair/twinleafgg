"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.Logger = exports.LogLevel = void 0;
const config_1 = require("../config");
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
class Logger {
    constructor() {
        this.metrics = {
            totalDisconnections: 0,
            totalReconnectionAttempts: 0,
            successfulReconnections: 0,
            failedReconnections: 0,
            averageReconnectionTime: 0,
            expiredSessions: 0,
            preservedStatesCount: 0,
            cleanupOperations: 0,
            errorCount: 0,
            lastResetTime: Date.now()
        };
        this.reconnectionTimes = [];
        this.logBuffer = [];
        this.maxBufferSize = 1000;
    }
    log(message) {
        if (!config_1.config.core.debug) {
            return;
        }
        console.log(message);
    }
    logStructured(entry) {
        var _a, _b, _c;
        const logEntry = Object.assign({ timestamp: Date.now(), level: (_a = entry.level) !== null && _a !== void 0 ? _a : LogLevel.INFO, category: (_b = entry.category) !== null && _b !== void 0 ? _b : 'general', message: (_c = entry.message) !== null && _c !== void 0 ? _c : '' }, entry);
        // Add to buffer
        this.logBuffer.push(logEntry);
        if (this.logBuffer.length > this.maxBufferSize) {
            this.logBuffer.shift();
        }
        // Console output based on debug setting and log level
        if (true || logEntry.level >= LogLevel.WARN) {
            const timestamp = new Date(logEntry.timestamp).toISOString();
            const levelStr = LogLevel[logEntry.level];
            const prefix = `[${timestamp}] [${levelStr}] [${logEntry.category}]`;
            let output = `${prefix} ${logEntry.message}`;
            if (logEntry.userId) {
                output += ` userId=${logEntry.userId}`;
            }
            if (logEntry.gameId) {
                output += ` gameId=${logEntry.gameId}`;
            }
            if (logEntry.sessionId) {
                output += ` sessionId=${logEntry.sessionId}`;
            }
            if (logEntry.data) {
                output += ` data=${JSON.stringify(logEntry.data)}`;
            }
            console.log(output);
            if (logEntry.error) {
                console.error(logEntry.error);
            }
        }
    }
    // Reconnection-specific logging methods
    logDisconnection(userId, gameId, reason, sessionId) {
        this.metrics.totalDisconnections++;
        this.logStructured({
            level: LogLevel.INFO,
            category: 'reconnection',
            message: 'Player disconnected',
            userId,
            gameId,
            sessionId,
            data: { reason, timestamp: Date.now() }
        });
    }
    logReconnectionAttempt(userId, gameId, attemptNumber, sessionId) {
        this.metrics.totalReconnectionAttempts++;
        this.logStructured({
            level: LogLevel.INFO,
            category: 'reconnection',
            message: 'Reconnection attempt started',
            userId,
            gameId,
            sessionId,
            data: { attemptNumber, timestamp: Date.now() }
        });
    }
    logReconnectionSuccess(userId, gameId, reconnectionTimeMs, sessionId) {
        this.metrics.successfulReconnections++;
        this.reconnectionTimes.push(reconnectionTimeMs);
        // Update average reconnection time
        const sum = this.reconnectionTimes.reduce((acc, time) => acc + time, 0);
        this.metrics.averageReconnectionTime = sum / this.reconnectionTimes.length;
        // Keep only last 100 reconnection times for average calculation
        if (this.reconnectionTimes.length > 100) {
            this.reconnectionTimes.shift();
        }
        this.logStructured({
            level: LogLevel.INFO,
            category: 'reconnection',
            message: 'Reconnection successful',
            userId,
            gameId,
            sessionId,
            data: { reconnectionTimeMs, timestamp: Date.now() }
        });
    }
    logReconnectionFailure(userId, gameId, reason, sessionId, error) {
        this.metrics.failedReconnections++;
        this.metrics.errorCount++;
        this.logStructured({
            level: LogLevel.ERROR,
            category: 'reconnection',
            message: 'Reconnection failed',
            userId,
            gameId,
            sessionId,
            data: { reason, timestamp: Date.now() },
            error
        });
    }
    logStatePreservation(userId, gameId, success, sessionId, error) {
        if (success) {
            this.metrics.preservedStatesCount++;
            this.logStructured({
                level: LogLevel.INFO,
                category: 'state-preservation',
                message: 'Game state preserved successfully',
                userId,
                gameId,
                sessionId,
                data: { timestamp: Date.now() }
            });
        }
        else {
            this.metrics.errorCount++;
            this.logStructured({
                level: LogLevel.ERROR,
                category: 'state-preservation',
                message: 'Failed to preserve game state',
                userId,
                gameId,
                sessionId,
                data: { timestamp: Date.now() },
                error
            });
        }
    }
    logStateRestoration(userId, gameId, success, sessionId, error) {
        if (success) {
            this.logStructured({
                level: LogLevel.INFO,
                category: 'state-restoration',
                message: 'Game state restored successfully',
                userId,
                gameId,
                sessionId,
                data: { timestamp: Date.now() }
            });
        }
        else {
            this.metrics.errorCount++;
            this.logStructured({
                level: LogLevel.ERROR,
                category: 'state-restoration',
                message: 'Failed to restore game state',
                userId,
                gameId,
                sessionId,
                data: { timestamp: Date.now() },
                error
            });
        }
    }
    logSessionExpiry(userId, gameId, sessionId) {
        this.metrics.expiredSessions++;
        this.logStructured({
            level: LogLevel.WARN,
            category: 'session-management',
            message: 'Disconnected session expired',
            userId,
            gameId,
            sessionId,
            data: { timestamp: Date.now() }
        });
    }
    logCleanupOperation(operation, count, durationMs) {
        this.metrics.cleanupOperations++;
        this.logStructured({
            level: LogLevel.INFO,
            category: 'cleanup',
            message: `Cleanup operation completed: ${operation}`,
            data: {
                operation,
                itemsProcessed: count,
                durationMs,
                timestamp: Date.now()
            }
        });
    }
    logConnectionQualityChange(userId, previousQuality, currentQuality, metrics) {
        this.logStructured({
            level: currentQuality === 'unstable' ? LogLevel.WARN : LogLevel.INFO,
            category: 'connection-monitor',
            message: 'Connection quality changed',
            userId,
            data: {
                previousQuality,
                currentQuality,
                metrics,
                timestamp: Date.now()
            }
        });
    }
    logAutomaticReconnectionAttempt(userId, attemptNumber, maxAttempts, nextAttemptIn) {
        this.logStructured({
            level: LogLevel.INFO,
            category: 'auto-reconnection',
            message: 'Automatic reconnection attempt',
            userId,
            data: {
                attemptNumber,
                maxAttempts,
                nextAttemptIn,
                timestamp: Date.now()
            }
        });
    }
    // Metrics and monitoring methods
    getReconnectionMetrics() {
        return Object.assign({}, this.metrics);
    }
    resetMetrics() {
        this.metrics = {
            totalDisconnections: 0,
            totalReconnectionAttempts: 0,
            successfulReconnections: 0,
            failedReconnections: 0,
            averageReconnectionTime: 0,
            expiredSessions: 0,
            preservedStatesCount: 0,
            cleanupOperations: 0,
            errorCount: 0,
            lastResetTime: Date.now()
        };
        this.reconnectionTimes = [];
    }
    getRecentLogs(category, level, limit = 100) {
        let filteredLogs = this.logBuffer;
        if (category) {
            filteredLogs = filteredLogs.filter(entry => entry.category === category);
        }
        if (level !== undefined) {
            filteredLogs = filteredLogs.filter(entry => entry.level >= level);
        }
        return filteredLogs
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
    }
    getLogSummary() {
        const summary = {};
        for (const entry of this.logBuffer) {
            if (!summary[entry.category]) {
                summary[entry.category] = {};
            }
            const levelStr = LogLevel[entry.level];
            summary[entry.category][levelStr] = (summary[entry.category][levelStr] || 0) + 1;
        }
        return summary;
    }
    exportLogs(category, startTime, endTime) {
        let filteredLogs = this.logBuffer;
        if (category) {
            filteredLogs = filteredLogs.filter(entry => entry.category === category);
        }
        if (startTime) {
            filteredLogs = filteredLogs.filter(entry => entry.timestamp >= startTime);
        }
        if (endTime) {
            filteredLogs = filteredLogs.filter(entry => entry.timestamp <= endTime);
        }
        return filteredLogs.sort((a, b) => a.timestamp - b.timestamp);
    }
}
exports.Logger = Logger;
exports.logger = new Logger();
