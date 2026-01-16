"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Core = void 0;
const add_player_action_1 = require("../store/actions/add-player-action");
const cleaner_task_1 = require("../tasks/cleaner-task");
const game_error_1 = require("../game-error");
const game_message_1 = require("../game-message");
const game_1 = require("./game");
const game_settings_1 = require("./game-settings");
const invite_player_action_1 = require("../store/actions/invite-player-action");
const messager_1 = require("./messager");
const ranking_calculator_1 = require("./ranking-calculator");
const utils_1 = require("../../utils");
const config_1 = require("../../config");
const card_types_1 = require("../store/card/card-types");
const abort_game_action_1 = require("../store/actions/abort-game-action");
const abort_game_action_2 = require("../store/actions/abort-game-action");
const state_1 = require("../store/state/state");
const bot_manager_1 = require("../bots/bot-manager");
const reconnection_manager_1 = require("../../backend/services/reconnection-manager");
const logger_1 = require("../../utils/logger");
const utils_2 = require("../../utils/utils");
class Core {
    constructor(reconnectionConfig) {
        this.clients = [];
        this.games = [];
        this.messager = new messager_1.Messager(this);
        this.botManager = bot_manager_1.BotManager.getInstance();
        // Initialize reconnection manager with default config if not provided
        const defaultConfig = {
            preservationTimeoutMs: 5 * 60 * 1000,
            maxAutoReconnectAttempts: 3,
            reconnectIntervals: [5000, 10000, 15000],
            healthCheckIntervalMs: 30 * 1000,
            cleanupIntervalMs: 60 * 1000,
            maxPreservedSessionsPerUser: 1
        };
        this.reconnectionManager = new reconnection_manager_1.ReconnectionManager(reconnectionConfig || defaultConfig);
        const cleanerTask = new cleaner_task_1.CleanerTask(this);
        cleanerTask.startTasks();
        this.startRankingDecrease();
        this.startInactiveGameCleanup();
    }
    getBotManager() {
        return this.botManager;
    }
    getReconnectionManager() {
        return this.reconnectionManager;
    }
    async connect(client) {
        client.id = utils_1.generateId(this.clients);
        client.core = this;
        client.games = [];
        // Add client to the core
        this.clients.push(client);
        // Emit connection events to notify other clients
        this.emit(c => c.onConnect(client));
        // Send updated user list to all clients to show the new user as online
        this.broadcastUserUpdates();
        return client;
    }
    async disconnect(client, reason = 'unknown') {
        const index = this.clients.indexOf(client);
        if (index === -1) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ERROR_CLIENT_NOT_CONNECTED);
        }
        // Leave all games
        client.games.forEach(game => this.leaveGame(client, game));
        // Remove client from core
        this.clients.splice(index, 1);
        client.core = undefined;
        // Notify other clients
        this.emit(c => c.onDisconnect(client));
        // Send updated user list to all clients to show the user as offline
        this.broadcastUserUpdates();
    }
    createGame(client, deck, gameSettings = new game_settings_1.GameSettings(), invited, deckId1, deckId2) {
        if (this.clients.indexOf(client) === -1) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ERROR_CLIENT_NOT_CONNECTED);
        }
        if (invited && this.clients.indexOf(invited) === -1) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ERROR_CLIENT_NOT_CONNECTED);
        }
        // Check if either client is a bot with format restrictions
        if (invited && this.isBotClient(invited)) {
            const botClient = invited; // Cast to access bot-specific methods
            if (!botClient.isFormatAllowed(gameSettings.format)) {
                throw new game_error_1.GameError(game_message_1.GameCoreError.ERROR_BOT_FORMAT_NOT_ALLOWED);
            }
        }
        if (this.isBotClient(client)) {
            const botClient = client; // Cast to access bot-specific methods
            if (!botClient.isFormatAllowed(gameSettings.format)) {
                throw new game_error_1.GameError(game_message_1.GameCoreError.ERROR_BOT_FORMAT_NOT_ALLOWED);
            }
        }
        if (gameSettings.format === card_types_1.Format.RETRO) {
            gameSettings.rules.attackFirstTurn = true;
            gameSettings.rules.firstTurnDrawCard = false;
        }
        if (gameSettings.format === card_types_1.Format.RSPK) {
            gameSettings.rules.attackFirstTurn = true;
            gameSettings.rules.firstTurnDrawCard = false;
        }
        if (gameSettings.format === card_types_1.Format.BW) {
            gameSettings.rules.attackFirstTurn = true;
            gameSettings.rules.firstTurnDrawCard = true;
            gameSettings.rules.firstTurnUseSupporter = true;
        }
        const game = new game_1.Game(this, utils_1.generateId(this.games), gameSettings);
        game.dispatch(client, new add_player_action_1.AddPlayerAction(client.id, client.name, deck, undefined, deckId1));
        if (invited) {
            game.dispatch(client, new invite_player_action_1.InvitePlayerAction(invited.id, invited.name));
        }
        this.games.push(game);
        this.emit(c => c.onGameAdd(game));
        this.joinGame(client, game);
        if (invited) {
            this.joinGame(invited, game);
        }
        return game;
    }
    createGameWithDecks(client, deck, gameSettings = new game_settings_1.GameSettings(), client2, deck2, artworksMap1, artworksMap2, deckId1, deckId2) {
        if (this.clients.indexOf(client) === -1) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ERROR_CLIENT_NOT_CONNECTED);
        }
        if (this.clients.indexOf(client2) === -1) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ERROR_CLIENT_NOT_CONNECTED);
        }
        console.log(`[Matchmaking] Match created between ${client.name} and ${client2.name} (Format: ${gameSettings.format})`);
        if (gameSettings.format === card_types_1.Format.RETRO) {
            gameSettings.rules.attackFirstTurn = true;
            gameSettings.rules.firstTurnDrawCard = false;
        }
        if (gameSettings.format === card_types_1.Format.RSPK) {
            gameSettings.rules.attackFirstTurn = true;
            gameSettings.rules.firstTurnDrawCard = false;
        }
        if (gameSettings.format === card_types_1.Format.BW) {
            gameSettings.rules.attackFirstTurn = true;
            gameSettings.rules.firstTurnDrawCard = true;
            gameSettings.rules.firstTurnUseSupporter = true;
        }
        const game = new game_1.Game(this, utils_1.generateId(this.games), gameSettings);
        game.dispatch(client, new add_player_action_1.AddPlayerAction(client.id, client.name, deck, artworksMap1, deckId1));
        game.dispatch(client, new add_player_action_1.AddPlayerAction(client2.id, client2.name, deck2, artworksMap2, deckId2));
        this.games.push(game);
        this.emit(c => c.onGameAdd(game));
        this.joinGame(client, game);
        this.joinGame(client2, game);
        return game;
    }
    joinGame(client, game) {
        if (this.clients.indexOf(client) === -1) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ERROR_CLIENT_NOT_CONNECTED);
        }
        if (this.games.indexOf(game) === -1) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ERROR_GAME_NOT_FOUND);
        }
        if (client.games.indexOf(game) === -1) {
            this.emit(c => c.onGameJoin(game, client));
            client.games.push(game);
            game.clients.push(client);
        }
    }
    deleteGame(game) {
        game.clients.forEach(client => {
            const index = client.games.indexOf(game);
            if (index !== -1) {
                client.games.splice(index, 1);
                this.emit(c => c.onGameLeave(game, client));
            }
        });
        const index = this.games.indexOf(game);
        if (index !== -1) {
            this.games.splice(index, 1);
            this.emit(c => c.onGameDelete(game));
        }
    }
    leaveGame(client, game) {
        if (this.clients.indexOf(client) === -1) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ERROR_CLIENT_NOT_CONNECTED);
        }
        if (this.games.indexOf(game) === -1) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ERROR_GAME_NOT_FOUND);
        }
        const gameIndex = client.games.indexOf(game);
        const clientIndex = game.clients.indexOf(client);
        if (clientIndex !== -1 && gameIndex !== -1) {
            client.games.splice(gameIndex, 1);
            game.clients.splice(clientIndex, 1);
            this.emit(c => c.onGameLeave(game, client));
            game.handleClientLeave(client);
        }
        if (game.clients.length === 0) {
            this.deleteGame(game);
        }
    }
    emit(fn) {
        this.clients.forEach(fn);
    }
    /**
     * Broadcast user updates to all connected clients
     */
    broadcastUserUpdates() {
        // Get all unique users from connected clients
        const userIds = new Set(this.clients.map(c => c.user.id));
        const users = Array.from(userIds).map(userId => {
            const client = this.clients.find(c => c.user.id === userId);
            return client ? client.user : null;
        }).filter((user) => user !== null);
        // Emit user updates to all clients
        this.emit(c => c.onUsersUpdate(users));
    }
    startRankingDecrease() {
        const scheduler = utils_1.Scheduler.getInstance();
        const rankingCalculator = new ranking_calculator_1.RankingCalculator();
        scheduler.run(async () => {
            let users = await rankingCalculator.decreaseRanking();
            // Notify only about users which are currently connected
            const connectedUserIds = this.clients.map(c => c.user.id);
            users = users.filter(u => connectedUserIds.includes(u.id));
            this.emit(c => c.onUsersUpdate(users));
        }, config_1.config.core.rankingDecreaseIntervalCount);
    }
    startInactiveGameCleanup() {
        const scheduler = utils_1.Scheduler.getInstance();
        // Check for inactive games every 5 minutes
        scheduler.run(async () => {
            const inactiveTimeout = 5 * 60 * 1000; // 5 minutes
            for (const game of this.games) {
                if (game.isInactive(inactiveTimeout)) {
                    console.log(`[Game Cleanup] Checking inactive game ${game.id}`);
                    // Check if this game has preserved sessions before cleaning up
                    try {
                        const activeSessions = await this.reconnectionManager.getActiveDisconnectedSessions();
                        const gameHasPreservedSessions = activeSessions.some(session => session.gameId === game.id);
                        if (gameHasPreservedSessions) {
                            console.log(`[Game Cleanup] Skipping cleanup of game ${game.id} - has preserved sessions`);
                            continue;
                        }
                    }
                    catch (error) {
                        console.log(`[Game Cleanup] Error checking preserved sessions for game ${game.id}: ${error}`);
                        // If we can't check, skip cleanup to be safe
                        continue;
                    }
                    console.log(`[Game Cleanup] Cleaning up inactive game ${game.id}`);
                    // Force end the game
                    const state = game.state;
                    if (state.phase !== state_1.GamePhase.FINISHED) {
                        state.players.forEach(player => {
                            const action = new abort_game_action_1.AbortGameAction(player.id, abort_game_action_2.AbortGameReason.DISCONNECTED);
                            // Use the first client as the source for the abort action
                            if (game.clients.length > 0) {
                                game.dispatch(game.clients[0], action);
                            }
                        });
                    }
                    game.cleanup();
                    this.deleteGame(game);
                }
            }
        }, 5 * 60); // Run every 5 minutes
    }
    /**
     * Dispose of the Core and cleanup resources
     */
    dispose() {
        if (this.reconnectionManager) {
            this.reconnectionManager.dispose();
        }
        logger_1.logger.log('[Core] Disposed');
    }
    isBotClient(client) {
        // Check if the client has bot-specific methods
        return 'isFormatAllowed' in client && 'getAllowedFormats' in client;
    }
    /**
     * Creates a game initialized with a specific state.
     * Used for sandbox/viewer mode where a game state is loaded from base64.
     * The client will be assigned as the active player.
     */
    createGameFromState(client, state, gameSettings = new game_settings_1.GameSettings(), opponentClient) {
        if (this.clients.indexOf(client) === -1) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ERROR_CLIENT_NOT_CONNECTED);
        }
        if (opponentClient && this.clients.indexOf(opponentClient) === -1) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ERROR_CLIENT_NOT_CONNECTED);
        }
        // Enable sandbox mode for state-loaded games
        gameSettings.sandboxMode = true;
        // Create a new game
        const game = new game_1.Game(this, utils_1.generateId(this.games), gameSettings);
        // Clone and set the state directly
        const clonedState = utils_2.deepClone(state);
        // Update player IDs to match the clients
        // The human player is always players[0] (bottom of screen on client)
        // The opponent (bot) is always players[1] (top of screen on client)
        if (clonedState.players[0]) {
            clonedState.players[0].id = client.id;
            clonedState.players[0].name = client.name;
        }
        // If opponent client provided, update the opponent player's ID
        if (opponentClient && clonedState.players[1]) {
            clonedState.players[1].id = opponentClient.id;
            clonedState.players[1].name = opponentClient.name;
        }
        // Set the state on the game's store
        game.getStore().state = clonedState;
        // Initialize player stats for timer
        clonedState.players.forEach((player) => {
            player.usedSquawkAndSeizeThisTurn = false;
            game.playerStats.push({
                clientId: player.id,
                isTimeRunning: false,
                invalidMoves: 0,
                timeLeft: gameSettings.timeLimit
            });
        });
        // Add game to core
        this.games.push(game);
        this.emit(c => c.onGameAdd(game));
        // Join the client to the game
        this.joinGame(client, game);
        // Join the opponent client to the game if provided
        if (opponentClient) {
            this.joinGame(opponentClient, game);
        }
        // Trigger state change to notify clients
        game.onStateChange(clonedState);
        return game;
    }
}
exports.Core = Core;
