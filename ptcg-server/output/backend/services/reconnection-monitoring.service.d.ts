/// <reference types="node" />
import { ReconnectionMetrics, LogEntry } from '../../utils/logger';
import { ReconnectionManager } from './reconnection-manager';
import { ConnectionMonitor } from './connection-monitor';
export interface SystemHealthMetrics {
    reconnectionSystem: ReconnectionMetrics;
    activeConnections: number;
    activeDisconnectedSessions: number;
    systemUptime: number;
    memoryUsage: NodeJS.MemoryUsage;
    lastUpdated: number;
}
export interface DetailedMetrics {
    systemHealth: SystemHealthMetrics;
    connectionQualityDistribution: {
        [quality: string]: number;
    };
    recentErrors: LogEntry[];
    performanceMetrics: {
        averageDisconnectionHandlingTime: number;
        averageReconnectionTime: number;
        averageStatePreservationTime: number;
        averageStateRestorationTime: number;
    };
}
export declare class ReconnectionMonitoringService {
    private reconnectionManager;
    private connectionMonitor;
    private startTime;
    private metricsUpdateInterval;
    private currentMetrics;
    constructor(reconnectionManager: ReconnectionManager, connectionMonitor: ConnectionMonitor);
    /**
     * Get current system health metrics
     */
    getSystemHealthMetrics(): Promise<SystemHealthMetrics>;
    /**
     * Get detailed metrics including performance and error information
     */
    getDetailedMetrics(): Promise<DetailedMetrics>;
    /**
     * Get metrics for a specific time range
     */
    getMetricsForTimeRange(startTime: number, endTime: number): LogEntry[];
    /**
     * Get metrics for a specific category
     */
    getMetricsByCategory(category: string, limit?: number): LogEntry[];
    /**
     * Get error summary by category
     */
    getErrorSummary(): {
        [category: string]: {
            [level: string]: number;
        };
    };
    /**
     * Get reconnection success rate
     */
    getReconnectionSuccessRate(): number;
    /**
     * Get system alerts based on current metrics
     */
    getSystemAlerts(): Promise<SystemAlert[]>;
    /**
     * Reset all metrics
     */
    resetMetrics(): void;
    /**
     * Export metrics to JSON format
     */
    exportMetrics(format?: 'json' | 'csv'): Promise<string>;
    /**
     * Start periodic metrics collection
     */
    private startMetricsCollection;
    /**
     * Stop metrics collection
     */
    dispose(): void;
    /**
     * Get count of active disconnected sessions
     */
    private getActiveDisconnectedSessionsCount;
    /**
     * Get connection quality distribution
     */
    private getConnectionQualityDistribution;
    /**
     * Calculate performance metrics from recent logs
     */
    private calculatePerformanceMetrics;
    /**
     * Calculate average of an array of numbers
     */
    private calculateAverage;
}
export interface SystemAlert {
    level: 'info' | 'warning' | 'error';
    category: string;
    message: string;
    data?: any;
}
