export declare enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}
export interface LogEntry {
    timestamp: number;
    level: LogLevel;
    category: string;
    message: string;
    data?: any;
    userId?: number;
    gameId?: number;
    sessionId?: string;
    error?: Error;
}
export interface ReconnectionMetrics {
    totalDisconnections: number;
    totalReconnectionAttempts: number;
    successfulReconnections: number;
    failedReconnections: number;
    averageReconnectionTime: number;
    expiredSessions: number;
    preservedStatesCount: number;
    cleanupOperations: number;
    errorCount: number;
    lastResetTime: number;
}
export declare class Logger {
    private metrics;
    private reconnectionTimes;
    private logBuffer;
    private maxBufferSize;
    log(message: string): void;
    logStructured(entry: Partial<LogEntry>): void;
    logDisconnection(userId: number, gameId: number, reason: string, sessionId?: string): void;
    logReconnectionAttempt(userId: number, gameId: number, attemptNumber: number, sessionId?: string): void;
    logReconnectionSuccess(userId: number, gameId: number, reconnectionTimeMs: number, sessionId?: string): void;
    logReconnectionFailure(userId: number, gameId: number, reason: string, sessionId?: string, error?: Error): void;
    logStatePreservation(userId: number, gameId: number, success: boolean, sessionId?: string, error?: Error): void;
    logStateRestoration(userId: number, gameId: number, success: boolean, sessionId?: string, error?: Error): void;
    logSessionExpiry(userId: number, gameId: number, sessionId?: string): void;
    logCleanupOperation(operation: string, count: number, durationMs: number): void;
    logConnectionQualityChange(userId: number, previousQuality: string, currentQuality: string, metrics: any): void;
    logAutomaticReconnectionAttempt(userId: number, attemptNumber: number, maxAttempts: number, nextAttemptIn: number): void;
    getReconnectionMetrics(): ReconnectionMetrics;
    resetMetrics(): void;
    getRecentLogs(category?: string, level?: LogLevel, limit?: number): LogEntry[];
    getLogSummary(): {
        [category: string]: {
            [level: string]: number;
        };
    };
    exportLogs(category?: string, startTime?: number, endTime?: number): LogEntry[];
}
export declare const logger: Logger;
