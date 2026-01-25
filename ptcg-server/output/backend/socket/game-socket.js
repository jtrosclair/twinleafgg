"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSocket = void 0;
const game_1 = require("../../game");
const sandbox_modify_player_action_1 = require("../../game/store/actions/sandbox-modify-player-action");
const sandbox_modify_game_state_action_1 = require("../../game/store/actions/sandbox-modify-game-state-action");
const sandbox_modify_card_action_1 = require("../../game/store/actions/sandbox-modify-card-action");
const sandbox_modify_pokemon_action_1 = require("../../game/store/actions/sandbox-modify-pokemon-action");
const utils_1 = require("../../utils");
const change_avatar_action_1 = require("../../game/store/actions/change-avatar-action");
const core_socket_1 = require("./core-socket");
const errors_1 = require("../common/errors");
const resolve_prompt_action_1 = require("../../game/store/actions/resolve-prompt-action");
const state_sanitizer_1 = require("./state-sanitizer");
class GameSocket {
    constructor(client, socket, core, cache) {
        this.lastActivePlayerId = null; // Track last active player
        this.cache = cache;
        this.client = client;
        this.socket = socket;
        this.core = core;
        this.stateSanitizer = new state_sanitizer_1.StateSanitizer(client, cache);
        // game listeners
        this.socket.addListener('game:join', this.joinGame.bind(this));
        this.socket.addListener('game:leave', this.leaveGame.bind(this));
        this.socket.addListener('game:rejoin', this.rejoinGame.bind(this));
        this.socket.addListener('game:concede', this.concedeGame.bind(this));
        this.socket.addListener('game:getStatus', this.getGameStatus.bind(this));
        this.socket.addListener('game:action:ability', this.ability.bind(this));
        this.socket.addListener('game:action:trainerAbility', this.trainerAbility.bind(this));
        this.socket.addListener('game:action:energyAbility', this.energyAbility.bind(this));
        this.socket.addListener('game:action:attack', this.attack.bind(this));
        this.socket.addListener('game:action:stadium', this.stadium.bind(this));
        this.socket.addListener('game:action:play', this.playGame.bind(this));
        this.socket.addListener('game:action:playCard', this.playCard.bind(this));
        this.socket.addListener('game:action:resolvePrompt', this.resolvePrompt.bind(this));
        this.socket.addListener('game:action:retreat', this.retreat.bind(this));
        this.socket.addListener('game:action:reorderBench', this.reorderBench.bind(this));
        this.socket.addListener('game:action:reorderHand', this.reorderHand.bind(this));
        this.socket.addListener('game:action:passTurn', this.passTurn.bind(this));
        this.socket.addListener('game:action:appendLog', this.appendLog.bind(this));
        this.socket.addListener('game:action:changeAvatar', this.changeAvatar.bind(this));
        this.socket.addListener('game:action:pushStateChange', this.pushStateChange.bind(this));
        // Sandbox actions
        this.socket.addListener('game:sandbox:modifyPlayer', this.sandboxModifyPlayer.bind(this));
        this.socket.addListener('game:sandbox:modifyGameState', this.sandboxModifyGameState.bind(this));
        this.socket.addListener('game:sandbox:modifyCard', this.sandboxModifyCard.bind(this));
        this.socket.addListener('game:sandbox:modifyPokemon', this.sandboxModifyPokemon.bind(this));
    }
    onGameJoin(game, client) {
        //this.socket.emit(`game[${game.id}]:join`, { clientId: client.id });
    }
    onGameLeave(game, client) {
        this.socket.emit(`game[${game.id}]:leave`, { clientId: client.id });
    }
    onStateChange(game, state) {
        if (this.core.games.indexOf(game) !== -1) {
            game.setBonusHps(state);
            state = this.stateSanitizer.sanitize(state, game.id);
            // Emit turn start if active player changed
            const activePlayer = state.players[state.activePlayer];
            if (activePlayer && this.lastActivePlayerId !== activePlayer.id) {
                this.lastActivePlayerId = activePlayer.id;
                this.socket.emit(`game[${game.id}]:turnStart`, {
                    activePlayerId: activePlayer.id,
                    activePlayerName: activePlayer.name
                });
            }
            const serializer = new game_1.StateSerializer();
            const serializedState = serializer.serialize(state);
            const base64 = new utils_1.Base64();
            const stateData = base64.encode(serializedState);
            const playerStats = game.playerStats;
            this.socket.emit(`game[${game.id}]:stateChange`, { stateData, playerStats });
        }
    }
    joinGame(gameId, response) {
        const game = this.core.games.find(g => g.id === gameId);
        if (game === undefined) {
            response('error', errors_1.ApiErrorEnum.GAME_INVALID_ID);
            return;
        }
        this.cache.lastLogIdCache[game.id] = 0;
        this.core.joinGame(this.client, game);
        response('ok', core_socket_1.CoreSocket.buildGameState(game));
    }
    leaveGame(gameId, response) {
        const game = this.core.games.find(g => g.id === gameId);
        if (game === undefined) {
            response('error', errors_1.ApiErrorEnum.GAME_INVALID_ID);
            return;
        }
        delete this.cache.lastLogIdCache[game.id];
        this.core.leaveGame(this.client, game);
        response('ok');
    }
    async rejoinGame(params, response) {
        try {
            const gameId = params.gameId;
            // Find the game
            const game = this.core.games.find(g => g.id === gameId);
            if (!game) {
                response('error', errors_1.ApiErrorEnum.GAME_INVALID_ID);
                return;
            }
            // Check if the client is already in the game
            const isAlreadyInGame = game.clients.some(client => client.id === this.client.id);
            if (isAlreadyInGame) {
                // Client is already in the game, just return the current state
                this.cache.lastLogIdCache[game.id] = 0;
                response('ok', core_socket_1.CoreSocket.buildGameState(game));
                return;
            }
            const playerId = game.getPlayerIdForUser(this.client.user.id);
            if (!playerId) {
                response('error', errors_1.ApiErrorEnum.GAME_INVALID_ID);
                return;
            }
            // User is a player, check if they're disconnected
            const disconnectedPlayer = game.getDisconnectedPlayerInfo(playerId);
            if (!disconnectedPlayer) {
                // User is a player but not disconnected - they're already connected or never disconnected
                response('error', errors_1.ApiErrorEnum.GAME_INVALID_ID);
                return;
            }
            // User is disconnected, attempt reconnection
            if (this.client.id !== playerId) {
                this.client.id = playerId;
            }
            const reconnected = game.handlePlayerReconnection(this.client);
            if (reconnected) {
                // Successfully reconnected to the game
                this.cache.lastLogIdCache[game.id] = 0;
                if (!this.client.games.includes(game)) {
                    this.client.games.push(game);
                }
                response('ok', core_socket_1.CoreSocket.buildGameState(game));
                return;
            }
            else {
                response('error', errors_1.ApiErrorEnum.GAME_INVALID_ID);
                return;
            }
        }
        catch (error) {
            console.error('Error in rejoinGame:', error);
            response('error', errors_1.ApiErrorEnum.SERVER_ERROR);
        }
    }
    concedeGame(params, response) {
        const gameId = params.gameId;
        const game = this.core.games.find(g => g.id === gameId);
        if (game === undefined) {
            response('error', errors_1.ApiErrorEnum.GAME_INVALID_ID);
            return;
        }
        try {
            const action = new game_1.ConcedeAction(this.client.id);
            game.dispatch(this.client, action);
            response('ok');
        }
        catch (error) {
            console.error('Error in concedeGame:', error);
            response('error', errors_1.ApiErrorEnum.SERVER_ERROR);
        }
    }
    getGameStatus(gameId, response) {
        const game = this.core.games.find(g => g.id === gameId);
        if (game === undefined) {
            response('error', errors_1.ApiErrorEnum.GAME_INVALID_ID);
            return;
        }
        response('ok', core_socket_1.CoreSocket.buildGameState(game));
    }
    dispatch(gameId, action, response) {
        const game = this.core.games.find(g => g.id === gameId);
        if (game === undefined) {
            response('error', errors_1.ApiErrorEnum.GAME_INVALID_ID);
            return;
        }
        try {
            game.dispatch(this.client, action);
        }
        catch (error) {
            response('error', error.message);
        }
        response('ok');
    }
    ability(params, response) {
        const action = new game_1.UseAbilityAction(this.client.id, params.ability, params.target);
        this.dispatch(params.gameId, action, response);
    }
    trainerAbility(params, response) {
        const action = new game_1.UseTrainerAbilityAction(this.client.id, params.ability, params.target);
        this.dispatch(params.gameId, action, response);
    }
    energyAbility(params, response) {
        const action = new game_1.UseEnergyAbilityAction(this.client.id, params.ability, params.target);
        this.dispatch(params.gameId, action, response);
    }
    attack(params, response) {
        const action = new game_1.AttackAction(this.client.id, params.attack);
        this.dispatch(params.gameId, action, response);
    }
    stadium(params, response) {
        const action = new game_1.UseStadiumAction(this.client.id);
        this.dispatch(params.gameId, action, response);
    }
    playGame(params, response) {
        const action = new game_1.AddPlayerAction(this.client.id, this.client.user.name, params.deck);
        this.dispatch(params.gameId, action, response);
    }
    playCard(params, response) {
        const action = new game_1.PlayCardAction(this.client.id, params.handIndex, params.target);
        this.dispatch(params.gameId, action, response);
    }
    resolvePrompt(params, response) {
        const game = this.core.games.find(g => g.id === params.gameId);
        if (game === undefined) {
            response('error', errors_1.ApiErrorEnum.GAME_INVALID_ID);
            return;
        }
        const prompt = game.state.prompts.find(p => p.id === params.id);
        if (prompt === undefined) {
            response('error', errors_1.ApiErrorEnum.PROMPT_INVALID_ID);
            return;
        }
        try {
            params.result = prompt.decode(params.result, game.state);
            if (prompt.validate(params.result, game.state) === false) {
                response('error', errors_1.ApiErrorEnum.PROMPT_INVALID_RESULT);
                return;
            }
        }
        catch (error) {
            response('error', error);
            return;
        }
        const action = new resolve_prompt_action_1.ResolvePromptAction(params.id, params.result);
        this.dispatch(params.gameId, action, response);
    }
    reorderBench(params, response) {
        const action = new game_1.ReorderBenchAction(this.client.id, params.from, params.to);
        this.dispatch(params.gameId, action, response);
    }
    reorderHand(params, response) {
        const action = new game_1.ReorderHandAction(this.client.id, params.order);
        this.dispatch(params.gameId, action, response);
    }
    retreat(params, response) {
        const action = new game_1.RetreatAction(this.client.id, params.to);
        this.dispatch(params.gameId, action, response);
    }
    passTurn(params, response) {
        const action = new game_1.PassTurnAction(this.client.id);
        this.dispatch(params.gameId, action, response);
    }
    appendLog(params, response) {
        const message = (params.message || '').trim();
        if (message.length === 0 || message.length > 256) {
            response('error', errors_1.ApiErrorEnum.CANNOT_SEND_MESSAGE);
        }
        const action = new game_1.AppendLogAction(this.client.id, game_1.GameLog.LOG_TEXT, { text: message });
        this.dispatch(params.gameId, action, response);
    }
    changeAvatar(params, response) {
        const action = new change_avatar_action_1.ChangeAvatarAction(this.client.id, params.avatarName);
        this.dispatch(params.gameId, action, response);
    }
    pushStateChange(params, response) {
        const game = this.core.games.find(g => g.id === params.gameId);
        if (game === undefined) {
            response('error', errors_1.ApiErrorEnum.GAME_INVALID_ID);
            return;
        }
        try {
            // Decode the stateData
            const base64 = new utils_1.Base64();
            const serializedState = base64.decode(params.stateData);
            const serializer = new game_1.StateSerializer();
            const newState = serializer.deserialize(serializedState);
            // Update the game state directly via the store
            const store = game.getStore();
            store.state = newState;
            // Notify all clients about the state change
            this.onStateChange(game, newState);
            response('ok');
        }
        catch (error) {
            console.error('Error in pushStateChange:', error);
            response('error', errors_1.ApiErrorEnum.SERVER_ERROR);
        }
    }
    sandboxModifyPlayer(params, response) {
        // Validate admin role
        if (this.client.user.roleId !== 4) {
            response('error', errors_1.ApiErrorEnum.ACTION_INVALID);
            return;
        }
        const action = new sandbox_modify_player_action_1.SandboxModifyPlayerAction(this.client.id, params.targetPlayerId, params.modifications);
        this.dispatch(params.gameId, action, response);
    }
    sandboxModifyGameState(params, response) {
        // Validate admin role
        if (this.client.user.roleId !== 4) {
            response('error', errors_1.ApiErrorEnum.ACTION_INVALID);
            return;
        }
        const action = new sandbox_modify_game_state_action_1.SandboxModifyGameStateAction(this.client.id, params.modifications);
        this.dispatch(params.gameId, action, response);
    }
    sandboxModifyCard(params, response) {
        // Validate admin role
        if (this.client.user.roleId !== 4) {
            response('error', errors_1.ApiErrorEnum.ACTION_INVALID);
            return;
        }
        const action = new sandbox_modify_card_action_1.SandboxModifyCardAction(this.client.id, params.targetPlayerId, params.action, params.cardName, params.fromZone, params.toZone, params.fromIndex, params.toIndex, params.prizeIndex);
        this.dispatch(params.gameId, action, response);
    }
    sandboxModifyPokemon(params, response) {
        // Validate admin role
        if (this.client.user.roleId !== 4) {
            response('error', errors_1.ApiErrorEnum.ACTION_INVALID);
            return;
        }
        const action = new sandbox_modify_pokemon_action_1.SandboxModifyPokemonAction(this.client.id, params.targetPlayerId, params.location, params.modifications, params.benchIndex);
        this.dispatch(params.gameId, action, response);
    }
    onTimerUpdate(game, playerStats) {
        //this.socket.emit(`game[${game.id}]:timerUpdate`, { playerStats });
    }
    onPlayerDisconnected(game, disconnectedClient) {
        // Notify this client about the disconnection
        this.socket.emit(`game[${game.id}]:playerDisconnected`, {
            playerId: disconnectedClient.id,
            playerName: disconnectedClient.name,
            disconnectedAt: Date.now(),
            gamePhase: game.state.phase,
            isPaused: game.isPausedForDisconnection()
        });
    }
    onPlayerReconnected(game, reconnectedClient) {
        // Notify this client about the reconnection
        this.socket.emit(`game[${game.id}]:playerReconnected`, {
            playerId: reconnectedClient.id,
            playerName: reconnectedClient.name,
            reconnectedAt: Date.now(),
            gamePhase: game.state.phase,
            isPaused: game.isPausedForDisconnection()
        });
    }
    onConnectionStatusUpdate(game, connectionStatuses) {
        // Send connection status update to this client
        this.socket.emit(`game[${game.id}]:connectionStatusUpdate`, {
            connectionStatuses,
            gamePhase: game.state.phase,
            isPaused: game.isPausedForDisconnection()
        });
    }
    onReconnectionTimeout(game, playerId, playerName) {
        // Notify this client about reconnection timeout
        this.socket.emit(`game[${game.id}]:reconnectionTimeout`, {
            playerId,
            playerName,
            timeoutAt: Date.now(),
            gamePhase: game.state.phase
        });
    }
    onTimeoutWarning(game, timeRemaining) {
        // Send timeout warning to this client
        this.socket.emit(`game[${game.id}]:timeoutWarning`, {
            timeRemaining,
            gamePhase: game.state.phase
        });
    }
    dispose() {
        this.socket.removeListener('game:join');
        this.socket.removeListener('game:leave');
        this.socket.removeListener('game:rejoin');
        this.socket.removeListener('game:concede');
        this.socket.removeListener('game:getStatus');
        this.socket.removeListener('game:action:ability');
        this.socket.removeListener('game:action:trainerAbility');
        this.socket.removeListener('game:action:attack');
        this.socket.removeListener('game:action:stadium');
        this.socket.removeListener('game:action:play');
        this.socket.removeListener('game:action:playCard');
        this.socket.removeListener('game:action:resolvePrompt');
        this.socket.removeListener('game:action:retreat');
        this.socket.removeListener('game:action:reorderBench');
        this.socket.removeListener('game:action:reorderHand');
        this.socket.removeListener('game:action:passTurn');
        this.socket.removeListener('game:action:appendLog');
        this.socket.removeListener('game:action:changeAvatar');
        this.socket.removeListener('game:action:pushStateChange');
        this.socket.removeListener('game:sandbox:modifyPlayer');
        this.socket.removeListener('game:sandbox:modifyGameState');
        this.socket.removeListener('game:sandbox:modifyCard');
        this.socket.removeListener('game:sandbox:modifyPokemon');
    }
    onUndoing(game, playerName) {
        this.core.emit(c => {
            c.socket.emit(`game[${game.id}]:undoing`, { playerName });
        });
    }
    canUndo(params, response) {
        const game = this.core.games.find(g => g.id === params.gameId);
        if (game === undefined) {
            response('error', errors_1.ApiErrorEnum.GAME_INVALID_ID);
            return;
        }
        const clientId = this.client.id;
        const result = game.canUndo(clientId);
        response('ok', { canUndo: result });
    }
}
exports.GameSocket = GameSocket;
