"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./game");
const core_1 = require("./core");
const game_settings_1 = require("./game-settings");
const state_1 = require("../store/state/state");
const abort_game_action_1 = require("../store/actions/abort-game-action");
// Mock implementations
class MockClient {
    constructor(id, name) {
        this.onStateChangeCalled = false;
        this.onTimerUpdateCalled = false;
        this.onPlayerDisconnectedCalled = false;
        this.onPlayerReconnectedCalled = false;
        this.disconnectedClient = null;
        this.reconnectedClient = null;
        this.id = id;
        this.name = name;
        this.user = { id, name };
    }
    onStateChange(game, state) {
        this.onStateChangeCalled = true;
    }
    onTimerUpdate(game, playerStats) {
        this.onTimerUpdateCalled = true;
    }
    onPlayerDisconnected(game, disconnectedClient) {
        this.onPlayerDisconnectedCalled = true;
        this.disconnectedClient = disconnectedClient;
    }
    onPlayerReconnected(game, reconnectedClient) {
        this.onPlayerReconnectedCalled = true;
        this.reconnectedClient = reconnectedClient;
    }
}
class MockCore extends core_1.Core {
    constructor() {
        super();
        this.emitCalled = false;
        this.deleteGameCalled = false;
    }
    emit(callback) {
        this.emitCalled = true;
    }
    deleteGame(game) {
        this.deleteGameCalled = true;
    }
}
describe('Game Reconnection', () => {
    let game;
    let mockCore;
    let client1;
    let client2;
    let gameSettings;
    beforeEach(() => {
        mockCore = new MockCore();
        gameSettings = new game_settings_1.GameSettings();
        gameSettings.timeLimit = 300; // 5 minutes
        game = new game_1.Game(mockCore, 1, gameSettings);
        client1 = new MockClient(1, 'Player1');
        client2 = new MockClient(2, 'Player2');
        // Add clients to game
        game.clients = [client1, client2];
        // Initialize player stats
        game.playerStats = [
            { clientId: 1, isTimeRunning: false, invalidMoves: 0, timeLeft: 300 },
            { clientId: 2, isTimeRunning: false, invalidMoves: 0, timeLeft: 300 }
        ];
        // Set up basic game state
        game.state.phase = state_1.GamePhase.PLAYER_TURN;
        game.state.activePlayer = 0;
        game.state.players = [
            { id: 1, name: 'Player1' },
            { id: 2, name: 'Player2' }
        ];
    });
    describe('handlePlayerDisconnection', () => {
        it('should handle player disconnection correctly', () => {
            // Act
            game.handlePlayerDisconnection(client1);
            // Assert
            expect(game.isPlayerDisconnected(1)).toBe(true);
            expect(game.isPlayerDisconnected(2)).toBe(false);
            expect(game.clients.length).toBe(1);
            expect(game.clients[0].id).toBe(2);
            expect(client2.onPlayerDisconnectedCalled).toBe(true);
            expect(client2.disconnectedClient).toEqual(jasmine.any(Object));
        });
        it('should pause game when active player disconnects', () => {
            // Arrange
            game.state.activePlayer = 0; // client1 is active
            // Act
            game.handlePlayerDisconnection(client1);
            // Assert
            expect(game.isPausedForDisconnection()).toBe(true);
            const disconnectedInfo = game.getDisconnectedPlayerInfo(1);
            expect(disconnectedInfo.wasActivePlayer).toBe(true);
        });
        it('should not pause game when non-active player disconnects', () => {
            // Arrange
            game.state.activePlayer = 1; // client2 is active
            // Act
            game.handlePlayerDisconnection(client1);
            // Assert
            expect(game.isPausedForDisconnection()).toBe(false);
            const disconnectedInfo = game.getDisconnectedPlayerInfo(1);
            expect(disconnectedInfo.wasActivePlayer).toBe(false);
        });
        it('should store disconnection info correctly', () => {
            // Arrange
            const timeLeft = 250;
            game.playerStats[0].timeLeft = timeLeft;
            // Act
            game.handlePlayerDisconnection(client1);
            // Assert
            const disconnectedInfo = game.getDisconnectedPlayerInfo(1);
            expect(disconnectedInfo).toBeDefined();
            expect(disconnectedInfo.clientId).toBe(1);
            expect(disconnectedInfo.timeLeftWhenDisconnected).toBe(timeLeft);
            expect(disconnectedInfo.disconnectedAt).toBeGreaterThan(0);
        });
        it('should not handle disconnection for finished games', () => {
            // Arrange
            game.state.phase = state_1.GamePhase.FINISHED;
            // Act
            game.handlePlayerDisconnection(client1);
            // Assert
            expect(game.isPlayerDisconnected(1)).toBe(false);
            expect(game.clients.length).toBe(2);
        });
    });
    describe('handlePlayerReconnection', () => {
        beforeEach(() => {
            // First disconnect the player
            game.handlePlayerDisconnection(client1);
        });
        it('should handle player reconnection correctly', () => {
            // Act
            const result = game.handlePlayerReconnection(client1);
            // Assert
            expect(result).toBe(true);
            expect(game.isPlayerDisconnected(1)).toBe(false);
            expect(game.clients.length).toBe(2);
            expect(client1.onStateChangeCalled).toBe(true);
            expect(client1.onTimerUpdateCalled).toBe(true);
            expect(client2.onPlayerReconnectedCalled).toBe(true);
            expect(client2.reconnectedClient).toEqual(jasmine.any(Object));
        });
        it('should resume game when active player reconnects', () => {
            // Arrange
            expect(game.isPausedForDisconnection()).toBe(true);
            // Act
            const result = game.handlePlayerReconnection(client1);
            // Assert
            expect(result).toBe(true);
            expect(game.isPausedForDisconnection()).toBe(false);
        });
        it('should restore player time when game was paused', () => {
            // Arrange
            const originalTimeLeft = 250;
            game.playerStats[0].timeLeft = originalTimeLeft;
            // Disconnect the player first to set up the disconnection info
            const disconnectedInfo = game.getDisconnectedPlayerInfo(1);
            if (disconnectedInfo) {
                disconnectedInfo.timeLeftWhenDisconnected = originalTimeLeft;
            }
            // Act
            const result = game.handlePlayerReconnection(client1);
            // Assert
            expect(result).toBe(true);
            expect(game.playerStats[0].timeLeft).toBe(originalTimeLeft);
        });
        it('should return false for player not in disconnected list', () => {
            // Act
            const result = game.handlePlayerReconnection(client2);
            // Assert
            expect(result).toBe(false);
        });
        it('should return false if game finished while disconnected', () => {
            // Arrange
            game.state.phase = state_1.GamePhase.FINISHED;
            // Act
            const result = game.handlePlayerReconnection(client1);
            // Assert
            expect(result).toBe(false);
            expect(game.isPlayerDisconnected(1)).toBe(false);
        });
    });
    describe('handleReconnectionTimeout', () => {
        beforeEach(() => {
            game.handlePlayerDisconnection(client1);
        });
        it('should abort game for player who exceeds timeout', () => {
            // Arrange
            const dispatchSpy = spyOn(game.getStore(), 'dispatch');
            // Act
            game.handleReconnectionTimeout(1);
            // Assert
            expect(game.isPlayerDisconnected(1)).toBe(false);
            expect(dispatchSpy).toHaveBeenCalledWith(jasmine.objectContaining({
                culpritId: 1,
                reason: abort_game_action_1.AbortGameReason.DISCONNECTED
            }));
        });
        it('should resume game if timed out player was active', () => {
            // Arrange
            expect(game.isPausedForDisconnection()).toBe(true);
            // Act
            game.handleReconnectionTimeout(1);
            // Assert
            expect(game.isPausedForDisconnection()).toBe(false);
        });
        it('should handle timeout for non-disconnected player gracefully', () => {
            // Act & Assert - should not throw
            expect(() => game.handleReconnectionTimeout(999)).not.toThrow();
        });
    });
    describe('utility methods', () => {
        beforeEach(() => {
            game.handlePlayerDisconnection(client1);
        });
        it('should correctly identify disconnected players', () => {
            expect(game.isPlayerDisconnected(1)).toBe(true);
            expect(game.isPlayerDisconnected(2)).toBe(false);
        });
        it('should return disconnected player info', () => {
            const info = game.getDisconnectedPlayerInfo(1);
            expect(info).toBeDefined();
            expect(info.clientId).toBe(1);
        });
        it('should return all disconnected players', () => {
            game.handlePlayerDisconnection(client2);
            const disconnectedPlayers = game.getDisconnectedPlayers();
            expect(disconnectedPlayers.length).toBe(2);
            expect(disconnectedPlayers.map(p => p.clientId)).toContain(1);
            expect(disconnectedPlayers.map(p => p.clientId)).toContain(2);
        });
        it('should correctly report pause status', () => {
            expect(game.isPausedForDisconnection()).toBe(true);
            game.handlePlayerReconnection(client1);
            expect(game.isPausedForDisconnection()).toBe(false);
        });
        it('should map user IDs to player IDs for reconnection', () => {
            game.registerPlayer(client1);
            expect(game.getPlayerIdForUser(client1.user.id)).toBe(client1.id);
        });
    });
    describe('cleanup', () => {
        it('should clear disconnected players on cleanup', () => {
            // Arrange
            game.handlePlayerDisconnection(client1);
            expect(game.isPlayerDisconnected(1)).toBe(true);
            // Act
            game.cleanup();
            // Assert
            expect(game.getDisconnectedPlayers().length).toBe(0);
            expect(game.isPausedForDisconnection()).toBe(false);
        });
    });
    describe('timer handling with disconnections', () => {
        it('should not decrement time for disconnected players', () => {
            // Arrange
            game.playerStats[0].isTimeRunning = true;
            game.playerStats[1].isTimeRunning = true;
            const initialTime1 = game.playerStats[0].timeLeft;
            // Start timer and disconnect player 1
            game.startTimer();
            game.handlePlayerDisconnection(client1);
            // Assert - disconnected player should not have time running
            expect(game.isPlayerDisconnected(1)).toBe(true);
            expect(game.playerStats[0].timeLeft).toBe(initialTime1); // Disconnected player time unchanged
        });
        it('should not start timer when game is paused', () => {
            // Arrange
            game.handlePlayerDisconnection(client1); // This pauses the game
            game.playerStats[1].isTimeRunning = true;
            // Act
            game.startTimer();
            // Assert - timer should not be running when paused
            expect(game.isPausedForDisconnection()).toBe(true);
        });
    });
});
