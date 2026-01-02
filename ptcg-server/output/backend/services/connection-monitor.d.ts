import { SocketClient } from '../socket/socket-client';
import { ConnectionMetrics, ReconnectionConfig } from '../interfaces/reconnection.interface';
export interface ConnectionMonitorOptions {
    pingInterval?: number;
    pingTimeout?: number;
    qualityCheckInterval?: number;
    maxLatencyForExcellent?: number;
    maxLatencyForGood?: number;
    maxLatencyForPoor?: number;
    maxPacketLossForStable?: number;
}
export declare class ConnectionMonitor {
    private monitoredConnections;
    private config;
    private options;
    private qualityCheckTimer?;
    constructor(config: ReconnectionConfig, options?: ConnectionMonitorOptions);
    /**
     * Start monitoring a client connection
     */
    startMonitoring(client: SocketClient): void;
    /**
     * Stop monitoring a client connection
     */
    stopMonitoring(client: SocketClient): void;
    /**
     * Check if a connection is stable
     */
    isConnectionStable(clientId: number): boolean;
    /**
     * Get connection metrics for a client
     */
    getConnectionMetrics(clientId: number): ConnectionMetrics | null;
    /**
     * Attempt automatic reconnection for a client
     */
    attemptAutomaticReconnection(clientId: number): Promise<boolean>;
    /**
     * Get all monitored connections
     */
    getMonitoredConnections(): ConnectionMetrics[];
    /**
     * Dispose of the connection monitor
     */
    dispose(): void;
    /**
     * Setup ping monitoring for a connection
     */
    private setupPingMonitoring;
    /**
     * Send a ping to a connection
     */
    private sendPing;
    /**
     * Test connection with a ping
     */
    private testConnection;
    /**
     * Calculate average latency for a connection
     */
    private calculateAverageLatency;
    /**
     * Calculate packet loss for a connection
     */
    private calculatePacketLoss;
    /**
     * Update connection quality based on metrics
     */
    private updateConnectionQuality;
    /**
     * Start the quality check timer
     */
    private startQualityCheckTimer;
}
