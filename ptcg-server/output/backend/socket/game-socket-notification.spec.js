"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_socket_1 = require("./game-socket");
const state_1 = require("../../game/store/state/state");
describe('GameSocket Notification System', () => {
    let gameSocket;
    let mockClient;
    let mockSocket;
    let mockCore;
    let mockCache;
    let mockGame;
    beforeEach(() => {
        // Create mocks
        mockSocket = {
            emit: jasmine.createSpy('emit'),
            addListener: jasmine.createSpy('addListener'),
            removeListener: jasmine.createSpy('removeListener'),
            attachListeners: jasmine.createSpy('attachListeners')
        };
        mockCore = {
            games: []
        };
        mockCache = {};
        mockClient = {
            id: 1,
            name: 'TestPlayer',
            user: { id: 1, name: 'TestPlayer' },
            games: []
        };
        mockGame = {
            id: 1,
            state: {
                phase: state_1.GamePhase.PLAYER_TURN,
                players: [
                    { id: 1, name: 'Player1' },
                    { id: 2, name: 'Player2' }
                ]
            },
            isPausedForDisconnection: jasmine.createSpy('isPausedForDisconnection').and.returnValue(false)
        };
        // Create GameSocket instance
        gameSocket = new game_socket_1.GameSocket(mockClient, mockSocket, mockCore, mockCache);
    });
    describe('Player Disconnection Notifications', () => {
        it('should have onPlayerDisconnected method', () => {
            expect(typeof gameSocket.onPlayerDisconnected).toBe('function');
        });
        it('should emit player disconnection event', () => {
            const disconnectedClient = {
                id: 2,
                name: 'Player2'
            };
            // Act
            gameSocket.onPlayerDisconnected(mockGame, disconnectedClient);
            // Assert
            expect(mockSocket.emit).toHaveBeenCalledWith('game[1]:playerDisconnected', jasmine.objectContaining({
                playerId: 2,
                playerName: 'Player2'
            }));
        });
    });
    describe('Player Reconnection Notifications', () => {
        it('should have onPlayerReconnected method', () => {
            expect(typeof gameSocket.onPlayerReconnected).toBe('function');
        });
        it('should emit player reconnection event', () => {
            const reconnectedClient = {
                id: 2,
                name: 'Player2'
            };
            // Act
            gameSocket.onPlayerReconnected(mockGame, reconnectedClient);
            // Assert
            expect(mockSocket.emit).toHaveBeenCalledWith('game[1]:playerReconnected', jasmine.objectContaining({
                playerId: 2,
                playerName: 'Player2'
            }));
        });
    });
    describe('Connection Status Updates', () => {
        it('should have onConnectionStatusUpdate method', () => {
            expect(typeof gameSocket.onConnectionStatusUpdate).toBe('function');
        });
        it('should emit connection status update', () => {
            const connectionStatuses = [
                { playerId: 1, playerName: 'Player1', isConnected: true }
            ];
            // Act
            gameSocket.onConnectionStatusUpdate(mockGame, connectionStatuses);
            // Assert
            expect(mockSocket.emit).toHaveBeenCalledWith('game[1]:connectionStatusUpdate', jasmine.objectContaining({
                connectionStatuses: connectionStatuses
            }));
        });
    });
    describe('Reconnection Timeout Notifications', () => {
        it('should have onReconnectionTimeout method', () => {
            expect(typeof gameSocket.onReconnectionTimeout).toBe('function');
        });
        it('should emit reconnection timeout event', () => {
            const playerId = 2;
            const playerName = 'Player2';
            // Act
            gameSocket.onReconnectionTimeout(mockGame, playerId, playerName);
            // Assert
            expect(mockSocket.emit).toHaveBeenCalledWith('game[1]:reconnectionTimeout', jasmine.objectContaining({
                playerId: 2,
                playerName: 'Player2'
            }));
        });
    });
    describe('Timeout Warning Notifications', () => {
        it('should have onTimeoutWarning method', () => {
            expect(typeof gameSocket.onTimeoutWarning).toBe('function');
        });
        it('should emit timeout warning', () => {
            const timeRemaining = 60000; // 1 minute
            // Act
            gameSocket.onTimeoutWarning(mockGame, timeRemaining);
            // Assert
            expect(mockSocket.emit).toHaveBeenCalledWith('game[1]:timeoutWarning', jasmine.objectContaining({
                timeRemaining: 60000
            }));
        });
    });
    describe('Event Naming Consistency', () => {
        it('should use consistent event naming pattern', () => {
            const gameId = 1;
            const expectedPrefix = `game[${gameId}]:`;
            const disconnectedClient = { id: 2, name: 'Player2' };
            const reconnectedClient = { id: 2, name: 'Player2' };
            const connectionStatuses = [{ playerId: 1, playerName: 'Player1', isConnected: true }];
            // Act - call all notification methods
            gameSocket.onPlayerDisconnected(mockGame, disconnectedClient);
            gameSocket.onPlayerReconnected(mockGame, reconnectedClient);
            gameSocket.onConnectionStatusUpdate(mockGame, connectionStatuses);
            gameSocket.onReconnectionTimeout(mockGame, 2, 'Player2');
            gameSocket.onTimeoutWarning(mockGame, 60000);
            // Assert - check all events use consistent naming
            const emitCalls = mockSocket.emit.calls.all();
            expect(emitCalls[0].args[0]).toBe(`${expectedPrefix}playerDisconnected`);
            expect(emitCalls[1].args[0]).toBe(`${expectedPrefix}playerReconnected`);
            expect(emitCalls[2].args[0]).toBe(`${expectedPrefix}connectionStatusUpdate`);
            expect(emitCalls[3].args[0]).toBe(`${expectedPrefix}reconnectionTimeout`);
            expect(emitCalls[4].args[0]).toBe(`${expectedPrefix}timeoutWarning`);
        });
    });
    describe('Data Validation', () => {
        it('should handle missing player data gracefully', () => {
            const disconnectedClient = {
                id: 0,
                name: ''
            };
            // Act & Assert - should not throw
            expect(() => {
                gameSocket.onPlayerDisconnected(mockGame, disconnectedClient);
            }).not.toThrow();
        });
        it('should handle empty connection statuses array', () => {
            const connectionStatuses = [];
            // Act & Assert - should not throw
            expect(() => {
                gameSocket.onConnectionStatusUpdate(mockGame, connectionStatuses);
            }).not.toThrow();
        });
        it('should handle negative time remaining in timeout warning', () => {
            const timeRemaining = -1000;
            // Act & Assert - should not throw
            expect(() => {
                gameSocket.onTimeoutWarning(mockGame, timeRemaining);
            }).not.toThrow();
        });
    });
});
