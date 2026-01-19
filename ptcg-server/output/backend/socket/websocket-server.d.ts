/// <reference types="node" />
import * as http from 'http';
import { Server, Socket } from 'socket.io';
import { Core } from '../../game/core/core';
import { ReconnectionManager } from '../services/reconnection-manager';
export type Middleware = (socket: Socket, next: (err?: any) => void) => void;
export declare class WebSocketServer {
    private core;
    server: Server | undefined;
    private reconnectionManager;
    constructor(core: Core);
    listen(httpServer: http.Server): Promise<void>;
    /**
     * Get the reconnection manager instance
     */
    getReconnectionManager(): ReconnectionManager;
    private findReconnectionTarget;
    /**
     * Dispose of the WebSocketServer and cleanup resources
     */
    dispose(): void;
}
