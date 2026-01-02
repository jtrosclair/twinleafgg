"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const websocket_server_1 = require("./websocket-server");
const storage_1 = require("../../storage");
describe('WebSocketServer', () => {
    let webSocketServer;
    let mockCore;
    let mockSocket;
    let mockUser;
    beforeEach(() => {
        mockCore = jasmine.createSpyObj('Core', ['connect', 'disconnect', 'games']);
        mockCore.games = [];
        webSocketServer = new websocket_server_1.WebSocketServer(mockCore);
        mockSocket = jasmine.createSpyObj('Socket', ['emit', 'disconnect']);
        mockSocket.handshake = {
            query: {},
            headers: {}
        };
        mockUser = new storage_1.User();
        mockUser.id = 1;
        mockUser.name = 'TestUser';
    });
    afterEach(() => {
        webSocketServer.dispose();
    });
    describe('constructor', () => {
        it('should create ReconnectionManager with config', () => {
            expect(webSocketServer.getReconnectionManager()).toBeDefined();
            expect(webSocketServer.getReconnectionManager().constructor.name).toBe('ReconnectionManager');
        });
    });
    describe('validateUserSessionForReconnection', () => {
        it('should return true for valid session', () => {
            const reconnectionStatus = {
                userId: 1,
                gameId: 123,
                disconnectedAt: Date.now() - 60000,
                expiresAt: Date.now() + 240000,
                gamePhase: 'SETUP',
                isPlayerTurn: false
            };
            const result = webSocketServer.validateUserSessionForReconnection(mockUser, reconnectionStatus);
            expect(result).toBe(true);
        });
        it('should return false for expired session', () => {
            const reconnectionStatus = {
                userId: 1,
                gameId: 123,
                disconnectedAt: Date.now() - 360000,
                expiresAt: Date.now() - 60000,
                gamePhase: 'SETUP',
                isPlayerTurn: false
            };
            const result = webSocketServer.validateUserSessionForReconnection(mockUser, reconnectionStatus);
            expect(result).toBe(false);
        });
        it('should return false for mismatched user ID', () => {
            const reconnectionStatus = {
                userId: 999,
                gameId: 123,
                disconnectedAt: Date.now() - 60000,
                expiresAt: Date.now() + 240000,
                gamePhase: 'SETUP',
                isPlayerTurn: false
            };
            const result = webSocketServer.validateUserSessionForReconnection(mockUser, reconnectionStatus);
            expect(result).toBe(false);
        });
        it('should return false for null user', () => {
            const reconnectionStatus = {
                userId: 1,
                gameId: 123,
                disconnectedAt: Date.now() - 60000,
                expiresAt: Date.now() + 240000,
                gamePhase: 'SETUP',
                isPlayerTurn: false
            };
            const result = webSocketServer.validateUserSessionForReconnection(null, reconnectionStatus);
            expect(result).toBe(false);
        });
        it('should return false for null reconnection status', () => {
            const result = webSocketServer.validateUserSessionForReconnection(mockUser, null);
            expect(result).toBe(false);
        });
    });
    describe('handleReconnectionAttempt', () => {
        let mockReconnectionManager;
        beforeEach(() => {
            mockReconnectionManager = jasmine.createSpyObj('ReconnectionManager', [
                'getReconnectionStatus',
                'handleReconnection',
                'dispose'
            ]);
            webSocketServer.reconnectionManager = mockReconnectionManager;
        });
        it('should return success false for normal connection', async () => {
            mockReconnectionManager.getReconnectionStatus.and.returnValue(Promise.resolve(null));
            const result = await webSocketServer.handleReconnectionAttempt(mockUser, mockSocket);
            expect(result.success).toBe(false);
            expect(mockReconnectionManager.getReconnectionStatus).toHaveBeenCalledWith(1);
        });
        it('should handle reconnection attempt when marked as such', async () => {
            mockSocket.isReconnectionAttempt = true;
            mockReconnectionManager.getReconnectionStatus.and.returnValue(Promise.resolve(null));
            const result = await webSocketServer.handleReconnectionAttempt(mockUser, mockSocket);
            expect(result.success).toBe(false);
            expect(result.error).toBe('No active disconnected session found');
            expect(mockSocket.emit).toHaveBeenCalledWith('reconnection:failed', jasmine.any(Object));
        });
        it('should attempt reconnection when valid session exists', async () => {
            const mockReconnectionStatus = {
                userId: 1,
                gameId: 123,
                disconnectedAt: Date.now() - 60000,
                expiresAt: Date.now() + 240000,
                gamePhase: 'SETUP',
                isPlayerTurn: false
            };
            mockReconnectionManager.getReconnectionStatus.and.returnValue(Promise.resolve(mockReconnectionStatus));
            mockReconnectionManager.handleReconnection.and.returnValue(Promise.resolve({
                success: true,
                gameId: 123,
                gameState: { phase: 'SETUP' }
            }));
            const result = await webSocketServer.handleReconnectionAttempt(mockUser, mockSocket);
            expect(result.success).toBe(true);
            expect(result.gameId).toBe(123);
            expect(mockSocket.emit).toHaveBeenCalledWith('reconnection:success', jasmine.any(Object));
        });
        it('should handle reconnection failure', async () => {
            const mockReconnectionStatus = {
                userId: 1,
                gameId: 123,
                disconnectedAt: Date.now() - 60000,
                expiresAt: Date.now() + 240000,
                gamePhase: 'SETUP',
                isPlayerTurn: false
            };
            mockReconnectionManager.getReconnectionStatus.and.returnValue(Promise.resolve(mockReconnectionStatus));
            mockReconnectionManager.handleReconnection.and.returnValue(Promise.resolve({
                success: false,
                error: 'Game state could not be restored'
            }));
            const result = await webSocketServer.handleReconnectionAttempt(mockUser, mockSocket);
            expect(result.success).toBe(false);
            expect(result.error).toBe('Game state could not be restored');
            expect(mockSocket.emit).toHaveBeenCalledWith('reconnection:failed', jasmine.any(Object));
        });
    });
    describe('dispose', () => {
        it('should dispose reconnection manager and close server', () => {
            const mockReconnectionManager = jasmine.createSpyObj('ReconnectionManager', ['dispose']);
            const mockServer = jasmine.createSpyObj('Server', ['close']);
            webSocketServer.reconnectionManager = mockReconnectionManager;
            webSocketServer.server = mockServer;
            webSocketServer.dispose();
            expect(mockReconnectionManager.dispose).toHaveBeenCalled();
            expect(mockServer.close).toHaveBeenCalled();
        });
    });
});
