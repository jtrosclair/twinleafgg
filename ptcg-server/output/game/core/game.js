"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const arbiter_1 = require("./arbiter");
const match_recorder_1 = require("./match-recorder");
const state_1 = require("../store/state/state");
const store_1 = require("../store/store");
const abort_game_action_1 = require("../store/actions/abort-game-action");
const card_types_1 = require("../store/card/card-types");
const check_effects_1 = require("../store/effects/check-effects");
const utils_1 = require("../../utils/utils");
const logger_1 = require("../../utils/logger");
class Game {
    constructor(core, id, gameSettings) {
        this.core = core;
        this.gameSettings = gameSettings;
        this.maxInvalidMoves = 100;
        this.clients = [];
        this.playerStats = [];
        this.arbiter = new arbiter_1.Arbiter();
        this.lastActivity = Date.now();
        this.format = card_types_1.Format.STANDARD;
        this.stateHistory = [];
        this.turnStartHistoryIndex = 0;
        // Reconnection-related properties
        this.disconnectedPlayers = new Map();
        this.disconnectionTimeouts = new Map();
        this.isPaused = false;
        this.pausedAt = 0;
        this.id = id;
        this.store = new store_1.Store(this);
        this.store.state.rules = gameSettings.rules;
        this.store.state.gameSettings = gameSettings;
        this.matchRecorder = new match_recorder_1.MatchRecorder(core);
        this.format = gameSettings.format;
    }
    get state() {
        return this.store.state;
    }
    getStore() {
        return this.store;
    }
    updateLastActivity() {
        this.lastActivity = Date.now();
    }
    getLastActivity() {
        return this.lastActivity;
    }
    isInactive(timeoutMs = 5 * 60 * 1000) {
        return Date.now() - this.lastActivity > timeoutMs;
    }
    cleanup() {
        this.stopTimer();
        if (this.matchRecorder) {
            this.matchRecorder.cleanup();
        }
        this.store.cleanup();
        this.arbiter.cleanup();
        // Clear all disconnection timeouts
        this.clearAllDisconnectionTimeouts();
        // Clear disconnected players tracking
        this.disconnectedPlayers.clear();
        this.isPaused = false;
    }
    setBonusHps(state) {
        for (const player of state.players) {
            if (player.active.getPokemonCard() !== undefined) {
                const checkHp = new check_effects_1.CheckHpEffect(player, player.active);
                this.store.reduceEffect(state, checkHp);
            }
            for (let b = 0; b < player.bench.length; b++) {
                if (player.bench[b].getPokemonCard() !== undefined) {
                    const checkHp = new check_effects_1.CheckHpEffect(player, player.bench[b]);
                    this.store.reduceEffect(state, checkHp);
                }
            }
        }
    }
    onStateChange(state) {
        this.updateLastActivity();
        if (this.handleArbiterPrompts(state)) {
            return;
        }
        if (this.gameSettings.recordingEnabled) {
            this.matchRecorder.onStateChange(state);
        }
        this.updateIsTimeRunning(state);
        this.core.emit(c => {
            if (typeof c.onStateChange === 'function') {
                c.onStateChange(this, state);
            }
        });
        // Clean up all disconnection timeouts if game is finished
        if (state.phase === state_1.GamePhase.FINISHED) {
            this.clearAllDisconnectionTimeouts();
        }
        if (state.phase !== state_1.GamePhase.FINISHED && this.timeoutRef === undefined) {
            this.startTimer();
        }
        if (state.phase !== state_1.GamePhase.FINISHED && this.periodicSyncRef === undefined) {
            this.startPeriodicSync();
        }
        if (state.phase === state_1.GamePhase.FINISHED) {
            this.stopTimer();
            this.stopPeriodicSync();
            this.core.deleteGame(this);
        }
    }
    handleArbiterPrompts(state) {
        let resolved;
        const unresolved = state.prompts.filter(item => item.result === undefined);
        for (let i = 0; i < unresolved.length; i++) {
            const action = this.arbiter.resolvePrompt(state, unresolved[i]);
            if (action !== undefined) {
                resolved = { id: unresolved[i].id, action };
                break;
            }
        }
        if (resolved === undefined) {
            return false;
        }
        this.store.dispatch(resolved.action);
        return true;
    }
    dispatch(client, action) {
        var _a;
        let state = this.store.state;
        try {
            this.stateHistory.push(utils_1.deepClone(state));
            if (this.isStartOfTurnAction(action, state)) {
                this.turnStartHistoryIndex = this.stateHistory.length - 1;
            }
            // Pass client roleId for sandbox actions
            const clientRoleId = (_a = client.user) === null || _a === void 0 ? void 0 : _a.roleId;
            state = this.store.dispatch(action, clientRoleId);
            state = this.updateInvalidMoves(state, client.id, false);
        }
        catch (error) {
            state = this.updateInvalidMoves(state, client.id, true);
            throw error;
        }
        return state;
    }
    isStartOfTurnAction(action, state) {
        return action.constructor.name === 'PassTurnAction';
    }
    handleClientLeave(client) {
        const state = this.store.state;
        if (state.phase === state_1.GamePhase.FINISHED) {
            return;
        }
        const player = state.players.find(p => p.id === client.id);
        if (player !== undefined) {
            // Instead of immediately aborting, handle as disconnection for reconnection system
            this.handlePlayerDisconnection(client);
        }
    }
    /**
     * Handle player disconnection - preserve state and notify other players
     */
    handlePlayerDisconnection(client) {
        var _a;
        const state = this.store.state;
        if (state.phase === state_1.GamePhase.FINISHED) {
            return;
        }
        const player = state.players.find(p => p.id === client.id);
        if (!player) {
            return;
        }
        const playerStats = this.playerStats.find(p => p.clientId === client.id);
        const wasActivePlayer = state.activePlayer !== undefined && ((_a = state.players[state.activePlayer]) === null || _a === void 0 ? void 0 : _a.id) === client.id;
        // Store disconnection info
        const disconnectedPlayer = {
            clientId: client.id,
            disconnectedAt: Date.now(),
            wasActivePlayer,
            timeLeftWhenDisconnected: (playerStats === null || playerStats === void 0 ? void 0 : playerStats.timeLeft) || 0
        };
        this.disconnectedPlayers.set(client.id, disconnectedPlayer);
        // Remove client from active clients list but keep in playerStats
        this.clients = this.clients.filter(c => c.id !== client.id);
        // Pause game if the disconnected player was the active player
        if (wasActivePlayer && !this.isPaused) {
            this.pauseGame();
        }
        // Schedule auto-forfeit timer (15 seconds)
        // Note: We already checked that state.phase !== FINISHED at the start of this method
        const timeout = setTimeout(() => {
            // Check if player is still disconnected and game is still active
            if (this.disconnectedPlayers.has(client.id) && this.state.phase !== state_1.GamePhase.FINISHED) {
                this.handleReconnectionTimeout(client.id);
            }
            // Remove timeout reference
            this.disconnectionTimeouts.delete(client.id);
        }, 15000); // 15 seconds
        this.disconnectionTimeouts.set(client.id, timeout);
        // Notify other players of disconnection
        this.notifyPlayersOfDisconnection(client);
        logger_1.logger.log(`Player disconnected from game: gameId=${this.id}, playerId=${client.id}, playerName=${client.name}, wasActivePlayer=${wasActivePlayer}, gamePhase=${state.phase}`);
    }
    /**
     * Handle player reconnection - restore state and resume game
     */
    handlePlayerReconnection(client) {
        const disconnectedPlayer = this.disconnectedPlayers.get(client.id);
        if (!disconnectedPlayer) {
            logger_1.logger.log(`Attempted reconnection for player not in disconnected list: gameId=${this.id}, playerId=${client.id}`);
            return false;
        }
        const state = this.store.state;
        if (state.phase === state_1.GamePhase.FINISHED) {
            // Game ended while player was disconnected
            this.disconnectedPlayers.delete(client.id);
            // Clean up timeout if it exists
            const timeout = this.disconnectionTimeouts.get(client.id);
            if (timeout) {
                clearTimeout(timeout);
                this.disconnectionTimeouts.delete(client.id);
            }
            return false;
        }
        // Cancel auto-forfeit timeout if player reconnects before 15 seconds
        const timeout = this.disconnectionTimeouts.get(client.id);
        if (timeout) {
            clearTimeout(timeout);
            this.disconnectionTimeouts.delete(client.id);
        }
        // Add client back to active clients
        this.clients.push(client);
        // Restore player's time (accounting for time passed while disconnected)
        const playerStats = this.playerStats.find(p => p.clientId === client.id);
        if (playerStats) {
            // If game was paused, restore original time; otherwise account for time passed
            if (this.isPaused) {
                playerStats.timeLeft = disconnectedPlayer.timeLeftWhenDisconnected;
            }
            else {
                const timePassed = Math.floor((Date.now() - disconnectedPlayer.disconnectedAt) / 1000);
                playerStats.timeLeft = Math.max(0, disconnectedPlayer.timeLeftWhenDisconnected - timePassed);
            }
        }
        // Resume game if it was paused due to this player's disconnection
        if (this.isPaused && disconnectedPlayer.wasActivePlayer) {
            this.resumeGame();
        }
        // Remove from disconnected players
        this.disconnectedPlayers.delete(client.id);
        // Synchronize client with current game state
        this.synchronizeReconnectedPlayer(client);
        // Notify other players of reconnection
        this.notifyPlayersOfReconnection(client);
        const disconnectionDuration = Date.now() - disconnectedPlayer.disconnectedAt;
        logger_1.logger.log(`Player reconnected to game: gameId=${this.id}, playerId=${client.id}, playerName=${client.name}, disconnectionDuration=${disconnectionDuration}, gamePhase=${state.phase}`);
        return true;
    }
    /**
     * Synchronize reconnected player with current game state
     */
    synchronizeReconnectedPlayer(client) {
        // Send current state to reconnected client
        if (typeof client.onStateChange === 'function') {
            client.onStateChange(this, this.store.state);
        }
        // Send current timer state
        if (typeof client.onTimerUpdate === 'function') {
            client.onTimerUpdate(this, this.playerStats);
        }
    }
    /**
     * Pause the game due to player disconnection
     */
    pauseGame() {
        if (this.isPaused) {
            return;
        }
        this.isPaused = true;
        this.pausedAt = Date.now();
        // Stop timer while paused
        this.stopTimer();
        logger_1.logger.log(`Game paused due to player disconnection: gameId=${this.id}, gamePhase=${this.store.state.phase}`);
    }
    /**
     * Resume the game after player reconnection
     */
    resumeGame() {
        if (!this.isPaused) {
            return;
        }
        this.isPaused = false;
        const pauseDuration = Date.now() - this.pausedAt;
        // Restart timer
        if (this.store.state.phase !== state_1.GamePhase.FINISHED) {
            this.startTimer();
        }
        logger_1.logger.log(`Game resumed after player reconnection: gameId=${this.id}, pauseDuration=${pauseDuration}, gamePhase=${this.store.state.phase}`);
    }
    /**
     * Notify other players of a disconnection
     */
    notifyPlayersOfDisconnection(disconnectedClient) {
        this.clients.forEach(client => {
            if (client.id !== disconnectedClient.id && typeof client.onPlayerDisconnected === 'function') {
                client.onPlayerDisconnected(this, disconnectedClient);
            }
        });
        // Also send connection status update to all players
        this.notifyConnectionStatusUpdate();
    }
    /**
     * Notify other players of a reconnection
     */
    notifyPlayersOfReconnection(reconnectedClient) {
        this.clients.forEach(client => {
            if (client.id !== reconnectedClient.id && typeof client.onPlayerReconnected === 'function') {
                client.onPlayerReconnected(this, reconnectedClient);
            }
        });
        // Also send connection status update to all players
        this.notifyConnectionStatusUpdate();
    }
    /**
     * Check if a player is currently disconnected
     */
    isPlayerDisconnected(clientId) {
        return this.disconnectedPlayers.has(clientId);
    }
    /**
     * Get disconnected player info
     */
    getDisconnectedPlayerInfo(clientId) {
        return this.disconnectedPlayers.get(clientId);
    }
    /**
     * Get all disconnected players
     */
    getDisconnectedPlayers() {
        return Array.from(this.disconnectedPlayers.values());
    }
    /**
     * Check if game is paused due to disconnections
     */
    isPausedForDisconnection() {
        return this.isPaused;
    }
    /**
     * Force abort game for players who exceed reconnection timeout
     */
    handleReconnectionTimeout(clientId) {
        var _a;
        const disconnectedPlayer = this.disconnectedPlayers.get(clientId);
        if (!disconnectedPlayer) {
            return;
        }
        const playerStats = this.playerStats.find(p => p.clientId === clientId);
        const playerName = playerStats ? ((_a = this.state.players.find(p => p.id === clientId)) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown' : 'Unknown';
        // Notify other players about the timeout
        this.notifyPlayersOfReconnectionTimeout(clientId, playerName);
        // Remove from disconnected players
        this.disconnectedPlayers.delete(clientId);
        // Remove timeout reference (should already be cleaned up, but ensure it's gone)
        const timeout = this.disconnectionTimeouts.get(clientId);
        if (timeout) {
            clearTimeout(timeout);
            this.disconnectionTimeouts.delete(clientId);
        }
        // Resume game if it was paused for this player
        if (this.isPaused && disconnectedPlayer.wasActivePlayer) {
            this.resumeGame();
        }
        // Abort game for the disconnected player
        const action = new abort_game_action_1.AbortGameAction(clientId, abort_game_action_1.AbortGameReason.DISCONNECTED);
        this.store.dispatch(action);
        logger_1.logger.log(`Player reconnection timeout - game aborted: gameId=${this.id}, playerId=${clientId}, disconnectionDuration=${Date.now() - disconnectedPlayer.disconnectedAt}`);
    }
    /**
     * Clear all disconnection timeouts
     */
    clearAllDisconnectionTimeouts() {
        for (const timeout of this.disconnectionTimeouts.values()) {
            clearTimeout(timeout);
        }
        this.disconnectionTimeouts.clear();
    }
    /**
     * Get connection status for all players in the game
     */
    getConnectionStatuses() {
        const statuses = [];
        this.state.players.forEach(player => {
            const isConnected = this.clients.some(c => c.id === player.id);
            const disconnectedPlayer = this.disconnectedPlayers.get(player.id);
            statuses.push({
                playerId: player.id,
                playerName: player.name,
                isConnected,
                disconnectedAt: disconnectedPlayer === null || disconnectedPlayer === void 0 ? void 0 : disconnectedPlayer.disconnectedAt
            });
        });
        return statuses;
    }
    /**
     * Notify players about connection status updates
     */
    notifyConnectionStatusUpdate() {
        const connectionStatuses = this.getConnectionStatuses();
        this.clients.forEach(client => {
            if (typeof client.onConnectionStatusUpdate === 'function') {
                client.onConnectionStatusUpdate(this, connectionStatuses);
            }
        });
    }
    /**
     * Notify players about reconnection timeout
     */
    notifyPlayersOfReconnectionTimeout(playerId, playerName) {
        this.clients.forEach(client => {
            if (typeof client.onReconnectionTimeout === 'function') {
                client.onReconnectionTimeout(this, playerId, playerName);
            }
        });
    }
    /**
     * Send timeout warning to disconnected player (if they reconnect)
     */
    sendTimeoutWarning(clientId, timeRemaining) {
        const client = this.clients.find(c => c.id === clientId);
        if (client && typeof client.onTimeoutWarning === 'function') {
            client.onTimeoutWarning(this, timeRemaining);
        }
    }
    updateInvalidMoves(state, playerId, isInvalidMove) {
        if (state.phase === state_1.GamePhase.FINISHED) {
            return state;
        }
        // Action dispatched not by the player
        const isPlayer = state.players.some(p => p.id === playerId);
        if (isPlayer === false) {
            return state;
        }
        const stats = this.playerStats.find(p => p.clientId === playerId);
        if (stats === undefined) {
            return state;
        }
        stats.invalidMoves = isInvalidMove ? stats.invalidMoves + 1 : 0;
        if (stats.invalidMoves > this.maxInvalidMoves) {
            const action = new abort_game_action_1.AbortGameAction(playerId, abort_game_action_1.AbortGameReason.ILLEGAL_MOVES);
            state = this.store.dispatch(action);
        }
        return state;
    }
    updateIsTimeRunning(state) {
        state.players.forEach(player => {
            const stats = this.playerStats.find(p => p.clientId === player.id);
            if (stats === undefined) {
                this.playerStats.push({
                    clientId: player.id,
                    isTimeRunning: false,
                    invalidMoves: 0,
                    timeLeft: this.gameSettings.timeLimit
                });
            }
        });
        this.playerStats.forEach(p => {
            p.isTimeRunning = false;
        });
    }
    startTimer() {
        return;
        const intervalDelay = 1000; // 1 second
        // Game time is set to unlimited
        if (this.gameSettings.timeLimit === 0) {
            return;
        }
        // Don't start timer if game is paused
        if (this.isPaused) {
            return;
        }
        this.timeoutRef = setInterval(() => {
            // Don't decrement time if game is paused
            if (this.isPaused) {
                return;
            }
            for (const stats of this.playerStats) {
                // Only decrement time for connected players who are actively playing
                const isDisconnected = this.isPlayerDisconnected(stats.clientId);
                if (stats.isTimeRunning && !isDisconnected) {
                    stats.timeLeft -= 1;
                    if (stats.timeLeft <= 0) {
                        const action = new abort_game_action_1.AbortGameAction(stats.clientId, abort_game_action_1.AbortGameReason.TIME_ELAPSED);
                        this.store.dispatch(action);
                        return;
                    }
                }
            }
            // Emit timer update to all connected clients
            this.clients.forEach(client => {
                if (typeof client.onTimerUpdate === 'function') {
                    client.onTimerUpdate(this, this.playerStats);
                }
            });
        }, intervalDelay);
    }
    stopTimer() {
        if (this.timeoutRef !== undefined) {
            clearInterval(this.timeoutRef);
            this.timeoutRef = undefined;
        }
    }
    startPeriodicSync() {
        this.periodicSyncRef = setInterval(() => {
            this.core.emit(c => {
                if (typeof c.onStateChange === 'function') {
                    c.onStateChange(this, this.state);
                }
            });
        }, 5000);
    }
    stopPeriodicSync() {
        if (this.periodicSyncRef !== undefined) {
            clearInterval(this.periodicSyncRef);
            this.periodicSyncRef = undefined;
        }
    }
    canUndo(clientId) {
        if (clientId !== undefined) {
            const state = this.store.state;
            const activePlayer = state.players[state.activePlayer];
            if (!activePlayer || activePlayer.id !== clientId) {
                return false;
            }
        }
        return this.stateHistory.length - 1 >= this.turnStartHistoryIndex - 1;
    }
    undo(clientId) {
        if (!this.canUndo(clientId))
            return false;
        if (this.stateHistory.length - 1 < this.turnStartHistoryIndex - 1)
            return false;
        const prevState = this.stateHistory.pop();
        if (!prevState)
            return false;
        this.store.state = utils_1.deepClone(prevState);
        this.onStateChange(this.store.state);
        return true;
    }
}
exports.Game = Game;
