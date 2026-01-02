"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionMonitor = void 0;
const logger_1 = require("../../utils/logger");
class ConnectionMonitor {
    constructor(config, options = {}) {
        var _a, _b, _c, _d, _e, _f, _g;
        this.monitoredConnections = new Map();
        this.config = config;
        this.options = {
            pingInterval: (_a = options.pingInterval) !== null && _a !== void 0 ? _a : 30000,
            pingTimeout: (_b = options.pingTimeout) !== null && _b !== void 0 ? _b : 10000,
            qualityCheckInterval: (_c = options.qualityCheckInterval) !== null && _c !== void 0 ? _c : 60000,
            maxLatencyForExcellent: (_d = options.maxLatencyForExcellent) !== null && _d !== void 0 ? _d : 50,
            maxLatencyForGood: (_e = options.maxLatencyForGood) !== null && _e !== void 0 ? _e : 150,
            maxLatencyForPoor: (_f = options.maxLatencyForPoor) !== null && _f !== void 0 ? _f : 500,
            maxPacketLossForStable: (_g = options.maxPacketLossForStable) !== null && _g !== void 0 ? _g : 0.05 // 5%
        };
        this.startQualityCheckTimer();
    }
    /**
     * Start monitoring a client connection
     */
    startMonitoring(client) {
        const clientId = client.user.id;
        if (this.monitoredConnections.has(clientId)) {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.WARN,
                category: 'connection-monitor',
                message: 'Already monitoring client, stopping previous monitoring',
                userId: clientId
            });
            this.stopMonitoring(client);
        }
        const monitoredConnection = {
            clientId,
            client,
            socket: client.socket.socket,
            startTime: Date.now(),
            lastPing: Date.now(),
            lastPong: Date.now(),
            pingHistory: [],
            packetsSent: 0,
            packetsReceived: 0,
            connectionQuality: 'excellent',
            isStable: true,
            pingTimer: undefined,
            reconnectionAttempts: 0,
            lastReconnectionAttempt: 0
        };
        this.monitoredConnections.set(clientId, monitoredConnection);
        this.setupPingMonitoring(monitoredConnection);
        logger_1.logger.logStructured({
            level: logger_1.LogLevel.INFO,
            category: 'connection-monitor',
            message: 'Started monitoring client connection',
            userId: clientId,
            data: {
                startTime: monitoredConnection.startTime,
                pingInterval: this.options.pingInterval
            }
        });
    }
    /**
     * Stop monitoring a client connection
     */
    stopMonitoring(client) {
        const clientId = client.user.id;
        const monitoredConnection = this.monitoredConnections.get(clientId);
        if (monitoredConnection) {
            const monitoringDuration = Date.now() - monitoredConnection.startTime;
            if (monitoredConnection.pingTimer) {
                clearInterval(monitoredConnection.pingTimer);
            }
            // Remove socket event listeners
            monitoredConnection.socket.off('pong', monitoredConnection.pongHandler);
            this.monitoredConnections.delete(clientId);
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.INFO,
                category: 'connection-monitor',
                message: 'Stopped monitoring client connection',
                userId: clientId,
                data: {
                    monitoringDurationMs: monitoringDuration,
                    finalQuality: monitoredConnection.connectionQuality,
                    totalPingsSent: monitoredConnection.packetsSent,
                    totalPongsReceived: monitoredConnection.packetsReceived,
                    reconnectionAttempts: monitoredConnection.reconnectionAttempts
                }
            });
        }
    }
    /**
     * Check if a connection is stable
     */
    isConnectionStable(clientId) {
        var _a;
        const connection = this.monitoredConnections.get(clientId);
        return (_a = connection === null || connection === void 0 ? void 0 : connection.isStable) !== null && _a !== void 0 ? _a : false;
    }
    /**
     * Get connection metrics for a client
     */
    getConnectionMetrics(clientId) {
        const connection = this.monitoredConnections.get(clientId);
        if (!connection) {
            return null;
        }
        const averageLatency = this.calculateAverageLatency(connection);
        const packetLoss = this.calculatePacketLoss(connection);
        return {
            clientId,
            lastPing: connection.lastPing,
            averageLatency,
            packetLoss,
            connectionQuality: connection.connectionQuality
        };
    }
    /**
     * Attempt automatic reconnection for a client
     */
    async attemptAutomaticReconnection(clientId) {
        const connection = this.monitoredConnections.get(clientId);
        if (!connection) {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.WARN,
                category: 'auto-reconnection',
                message: 'Cannot attempt reconnection for unknown client',
                userId: clientId
            });
            return false;
        }
        const now = Date.now();
        const timeSinceLastAttempt = now - connection.lastReconnectionAttempt;
        const minInterval = this.config.reconnectIntervals[Math.min(connection.reconnectionAttempts, this.config.reconnectIntervals.length - 1)];
        // Check if enough time has passed since last attempt
        if (timeSinceLastAttempt < minInterval) {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.DEBUG,
                category: 'auto-reconnection',
                message: 'Too soon for reconnection attempt',
                userId: clientId,
                data: {
                    timeSinceLastAttempt,
                    minInterval,
                    nextAttemptIn: minInterval - timeSinceLastAttempt
                }
            });
            return false;
        }
        // Check if we've exceeded max attempts
        if (connection.reconnectionAttempts >= this.config.maxAutoReconnectAttempts) {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.WARN,
                category: 'auto-reconnection',
                message: 'Max reconnection attempts reached',
                userId: clientId,
                data: {
                    attempts: connection.reconnectionAttempts,
                    maxAttempts: this.config.maxAutoReconnectAttempts
                }
            });
            return false;
        }
        connection.reconnectionAttempts++;
        connection.lastReconnectionAttempt = now;
        const nextAttemptIn = this.config.reconnectIntervals[Math.min(connection.reconnectionAttempts, this.config.reconnectIntervals.length - 1)];
        logger_1.logger.logAutomaticReconnectionAttempt(clientId, connection.reconnectionAttempts, this.config.maxAutoReconnectAttempts, nextAttemptIn);
        try {
            // Emit reconnection attempt event to client
            connection.socket.emit('connection:reconnect-attempt', {
                attempt: connection.reconnectionAttempts,
                maxAttempts: this.config.maxAutoReconnectAttempts,
                nextAttemptIn
            });
            // Test connection with a ping
            const pingResult = await this.testConnection(connection);
            if (pingResult.success) {
                connection.reconnectionAttempts = 0;
                connection.isStable = true;
                logger_1.logger.logStructured({
                    level: logger_1.LogLevel.INFO,
                    category: 'auto-reconnection',
                    message: 'Automatic reconnection successful',
                    userId: clientId,
                    data: {
                        latency: pingResult.latency,
                        quality: connection.connectionQuality
                    }
                });
                // Emit reconnection success
                connection.socket.emit('connection:reconnect-success', {
                    latency: pingResult.latency,
                    quality: connection.connectionQuality
                });
                return true;
            }
            else {
                logger_1.logger.logStructured({
                    level: logger_1.LogLevel.WARN,
                    category: 'auto-reconnection',
                    message: 'Automatic reconnection failed',
                    userId: clientId,
                    data: {
                        attempt: connection.reconnectionAttempts,
                        maxAttempts: this.config.maxAutoReconnectAttempts,
                        error: pingResult.error,
                        nextAttemptIn: connection.reconnectionAttempts < this.config.maxAutoReconnectAttempts ? nextAttemptIn : null
                    }
                });
                // Emit reconnection failure
                connection.socket.emit('connection:reconnect-failed', {
                    attempt: connection.reconnectionAttempts,
                    maxAttempts: this.config.maxAutoReconnectAttempts,
                    error: pingResult.error,
                    nextAttemptIn: connection.reconnectionAttempts < this.config.maxAutoReconnectAttempts ? nextAttemptIn : null
                });
                return false;
            }
        }
        catch (error) {
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.ERROR,
                category: 'auto-reconnection',
                message: 'Error during automatic reconnection',
                userId: clientId,
                data: {
                    attempt: connection.reconnectionAttempts,
                    maxAttempts: this.config.maxAutoReconnectAttempts
                },
                error: error
            });
            return false;
        }
    }
    /**
     * Get all monitored connections
     */
    getMonitoredConnections() {
        const metrics = [];
        for (const [clientId] of this.monitoredConnections) {
            const connectionMetrics = this.getConnectionMetrics(clientId);
            if (connectionMetrics) {
                metrics.push(connectionMetrics);
            }
        }
        return metrics;
    }
    /**
     * Dispose of the connection monitor
     */
    dispose() {
        // Stop quality check timer
        if (this.qualityCheckTimer) {
            clearInterval(this.qualityCheckTimer);
        }
        // Stop monitoring all connections
        for (const [, connection] of this.monitoredConnections) {
            if (connection.pingTimer) {
                clearInterval(connection.pingTimer);
            }
            if (connection.pongHandler) {
                connection.socket.off('pong', connection.pongHandler);
            }
        }
        this.monitoredConnections.clear();
        logger_1.logger.log('[ConnectionMonitor] Disposed');
    }
    /**
     * Setup ping monitoring for a connection
     */
    setupPingMonitoring(connection) {
        // Setup pong handler
        connection.pongHandler = (data) => {
            const now = Date.now();
            const latency = now - connection.lastPing;
            connection.lastPong = now;
            connection.packetsReceived++;
            // Add to ping history (keep last 10 pings)
            connection.pingHistory.push(latency);
            if (connection.pingHistory.length > 10) {
                connection.pingHistory.shift();
            }
            // Update connection quality
            this.updateConnectionQuality(connection);
            logger_1.logger.logStructured({
                level: logger_1.LogLevel.DEBUG,
                category: 'connection-monitor',
                message: 'Pong received',
                userId: connection.clientId,
                data: {
                    latency,
                    quality: connection.connectionQuality,
                    packetsReceived: connection.packetsReceived
                }
            });
        };
        connection.socket.on('pong', connection.pongHandler);
        // Setup ping timer
        connection.pingTimer = setInterval(() => {
            this.sendPing(connection);
        }, this.options.pingInterval);
        // Send initial ping
        this.sendPing(connection);
    }
    /**
     * Send a ping to a connection
     */
    sendPing(connection) {
        const now = Date.now();
        connection.lastPing = now;
        connection.packetsSent++;
        connection.socket.ping();
        // Check for ping timeout
        setTimeout(() => {
            if (connection.lastPong < connection.lastPing) {
                logger_1.logger.logStructured({
                    level: logger_1.LogLevel.WARN,
                    category: 'connection-monitor',
                    message: 'Ping timeout detected',
                    userId: connection.clientId,
                    data: {
                        lastPing: connection.lastPing,
                        lastPong: connection.lastPong,
                        timeoutMs: this.options.pingTimeout
                    }
                });
                connection.isStable = false;
                this.updateConnectionQuality(connection);
                // Emit connection unstable event
                connection.socket.emit('connection:unstable', {
                    reason: 'ping_timeout',
                    lastPing: connection.lastPing,
                    lastPong: connection.lastPong
                });
            }
        }, this.options.pingTimeout);
    }
    /**
     * Test connection with a ping
     */
    async testConnection(connection) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const timeout = setTimeout(() => {
                resolve({ success: false, error: 'Connection test timeout' });
            }, this.options.pingTimeout);
            const testPongHandler = () => {
                clearTimeout(timeout);
                const latency = Date.now() - startTime;
                connection.socket.off('pong', testPongHandler);
                resolve({ success: true, latency });
            };
            connection.socket.once('pong', testPongHandler);
            connection.socket.ping();
        });
    }
    /**
     * Calculate average latency for a connection
     */
    calculateAverageLatency(connection) {
        if (connection.pingHistory.length === 0) {
            return 0;
        }
        const sum = connection.pingHistory.reduce((acc, latency) => acc + latency, 0);
        return Math.round(sum / connection.pingHistory.length);
    }
    /**
     * Calculate packet loss for a connection
     */
    calculatePacketLoss(connection) {
        if (connection.packetsSent === 0) {
            return 0;
        }
        const lostPackets = connection.packetsSent - connection.packetsReceived;
        return Math.max(0, lostPackets / connection.packetsSent);
    }
    /**
     * Update connection quality based on metrics
     */
    updateConnectionQuality(connection) {
        const averageLatency = this.calculateAverageLatency(connection);
        const packetLoss = this.calculatePacketLoss(connection);
        let quality;
        if (packetLoss > this.options.maxPacketLossForStable) {
            quality = 'unstable';
            connection.isStable = false;
        }
        else if (averageLatency <= this.options.maxLatencyForExcellent) {
            quality = 'excellent';
            connection.isStable = true;
        }
        else if (averageLatency <= this.options.maxLatencyForGood) {
            quality = 'good';
            connection.isStable = true;
        }
        else if (averageLatency <= this.options.maxLatencyForPoor) {
            quality = 'poor';
            connection.isStable = true;
        }
        else {
            quality = 'unstable';
            connection.isStable = false;
        }
        // Only emit event if quality changed
        if (connection.connectionQuality !== quality) {
            const previousQuality = connection.connectionQuality;
            connection.connectionQuality = quality;
            logger_1.logger.logConnectionQualityChange(connection.clientId, previousQuality, quality, {
                averageLatency,
                packetLoss: Math.round(packetLoss * 100) / 100
            });
            // Emit quality change event
            connection.socket.emit('connection:quality-changed', {
                previousQuality,
                currentQuality: quality,
                averageLatency,
                packetLoss: Math.round(packetLoss * 100) / 100 // Round to 2 decimal places
            });
            // If connection became unstable, attempt automatic reconnection
            if (quality === 'unstable' && connection.isStable === false) {
                setTimeout(() => {
                    this.attemptAutomaticReconnection(connection.clientId);
                }, 1000); // Wait 1 second before attempting reconnection
            }
        }
    }
    /**
     * Start the quality check timer
     */
    startQualityCheckTimer() {
        this.qualityCheckTimer = setInterval(() => {
            for (const [, connection] of this.monitoredConnections) {
                this.updateConnectionQuality(connection);
            }
        }, this.options.qualityCheckInterval);
    }
}
exports.ConnectionMonitor = ConnectionMonitor;
