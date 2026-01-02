"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketServer = void 0;
const socket_io_1 = require("socket.io");
const socket_client_1 = require("./socket-client");
const auth_middleware_1 = require("./auth-middleware");
const config_1 = require("../../config");
const reconnection_manager_1 = require("../services/reconnection-manager");
const logger_1 = require("../../utils/logger");
class WebSocketServer {
    constructor(core) {
        this.core = core;
        this.reconnectionManager = new reconnection_manager_1.ReconnectionManager(config_1.config.reconnection);
    }
    async listen(httpServer) {
        const opts = {
            // Prefer stable websocket transport and avoid long-polling fallbacks
            transports: ['websocket'],
            // Make the server more tolerant to background tab throttling / flaky networks
            pingInterval: 30000,
            pingTimeout: 120000 // default 20000 → allow up to 2 minutes without pong
        };
        if (config_1.config.backend.allowCors) {
            opts.cors = { origin: '*' };
        }
        const server = new socket_io_1.Server(httpServer, opts);
        this.server = server;
        server.use(auth_middleware_1.authMiddleware);
        server.on('connection', async (socket) => {
            const user = socket.user;
            try {
                const socketClient = new socket_client_1.SocketClient(user, this.core, server, socket);
                // Simple connection - just connect to core
                await this.core.connect(socketClient);
                socketClient.attachListeners();
                socket.on('disconnect', async (reason) => {
                    try {
                        // Simple disconnection - just disconnect from core
                        await this.core.disconnect(socketClient, String(reason));
                        socketClient.dispose();
                        user.updateLastSeen();
                    }
                    catch (error) {
                        logger_1.logger.log(`[Socket] Error handling disconnection: ${error}`);
                    }
                });
            }
            catch (error) {
                logger_1.logger.log(`[Socket] Error during connection setup: ${error}`);
                socket.disconnect(true);
            }
        });
    }
    /**
     * Get the reconnection manager instance
     */
    getReconnectionManager() {
        return this.reconnectionManager;
    }
    /**
     * Dispose of the WebSocketServer and cleanup resources
     */
    dispose() {
        if (this.reconnectionManager) {
            this.reconnectionManager.dispose();
        }
        if (this.server) {
            this.server.close();
        }
    }
}
exports.WebSocketServer = WebSocketServer;
