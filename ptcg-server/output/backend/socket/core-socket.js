"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreSocket = void 0;
const game_1 = require("../../game");
const utils_1 = require("../../utils/utils");
const utils_2 = require("../../utils");
const errors_1 = require("../common/errors");
class CoreSocket {
    constructor(client, socket, core, cache) {
        this.cache = cache;
        this.client = client;
        this.socket = socket;
        this.core = core;
        // core listeners
        this.socket.addListener('core:getInfo', this.getCoreInfo.bind(this));
        this.socket.addListener('core:createGame', this.createGame.bind(this));
        this.socket.addListener('core:createGameFromState', this.createGameFromState.bind(this));
    }
    onConnect(client) {
        this.socket.emit('core:join', {
            clientId: client.id,
            user: CoreSocket.buildUserInfo(client.user)
        });
    }
    onDisconnect(client) {
        this.socket.emit('core:leave', client.id);
    }
    onGameAdd(game) {
        this.cache.lastLogIdCache[game.id] = 0;
        this.cache.gameInfoCache[game.id] = CoreSocket.buildGameInfo(game);
        this.socket.emit('core:createGame', this.cache.gameInfoCache[game.id]);
    }
    onGameDelete(game) {
        delete this.cache.gameInfoCache[game.id];
        delete this.cache.lastLogIdCache[game.id];
        this.socket.emit('core:deleteGame', game.id);
    }
    onStateChange(game, state) {
        const gameInfo = CoreSocket.buildGameInfo(game);
        if (!utils_1.deepCompare(gameInfo, this.cache.gameInfoCache[game.id])) {
            this.cache.gameInfoCache[game.id] = gameInfo;
            this.socket.emit('core:gameInfo', gameInfo);
        }
    }
    onUsersUpdate(users) {
        const core = this.client.core;
        if (core === undefined) {
            return;
        }
        const me = users.find(u => u.id === this.client.user.id);
        if (me !== undefined) {
            this.client.user = me;
        }
        const userInfos = users.map(u => {
            const connected = core.clients.some(c => c.user.id === u.id);
            return CoreSocket.buildUserInfo(u, connected);
        });
        this.socket.emit('core:usersInfo', userInfos);
    }
    buildCoreInfo() {
        return {
            clientId: this.client.id,
            clients: this.core.clients.map(client => ({
                clientId: client.id,
                userId: client.user.id
            })),
            users: this.core.clients.map(client => CoreSocket.buildUserInfo(client.user)),
            games: this.core.games.map(game => CoreSocket.buildGameInfo(game))
        };
    }
    getCoreInfo(data, response) {
        response('ok', this.buildCoreInfo());
    }
    createGame(params, response) {
        // Validate that only admins can enable sandbox mode
        if (params.gameSettings.sandboxMode && this.client.user.roleId !== 4) {
            response('error', errors_1.ApiErrorEnum.ACTION_INVALID);
            return;
        }
        let invited = this.core.clients.find(c => c.id === params.clientId);
        // If opponentUsername is provided and no clientId, look up the bot by username
        if (!invited && params.opponentUsername) {
            const botManager = this.core.getBotManager();
            try {
                invited = botManager.getBot(params.opponentUsername);
            }
            catch (error) {
                response('error', errors_1.ApiErrorEnum.ACTION_INVALID);
                return;
            }
        }
        // Check if the invited client is a bot with format restrictions
        if (invited && this.isBotClient(invited)) {
            const botClient = invited;
            if (!botClient.isFormatAllowed(params.gameSettings.format)) {
                response('error', errors_1.ApiErrorEnum.INVALID_FORMAT);
                return;
            }
            // Set the player's deck as the bot's pending deck so it can respond to the invite
            botClient.setPendingDeck(params.deck);
        }
        const game = this.core.createGame(this.client, params.deck, params.gameSettings, invited, params.deckId);
        response('ok', CoreSocket.buildGameState(game));
    }
    createGameFromState(params, response) {
        try {
            // Decode the base64 state data
            const base64 = new utils_2.Base64();
            const serializedState = base64.decode(params.stateData);
            // Normalize card names in the serialized state before deserialization
            const normalizedState = this.normalizeCardNamesInSerializedState(serializedState);
            const serializer = new game_1.StateSerializer();
            const state = serializer.deserialize(normalizedState);
            if (!state || !state.players || state.players.length === 0) {
                response('error', errors_1.ApiErrorEnum.ACTION_INVALID);
                return;
            }
            // Look up the opponent bot if username is provided
            let opponentClient;
            if (params.opponentUsername) {
                const botManager = this.core.getBotManager();
                try {
                    opponentClient = botManager.getBot(params.opponentUsername);
                }
                catch (error) {
                    console.error('Bot not found:', params.opponentUsername);
                    // Continue without opponent - game will work but opponent won't respond
                }
            }
            // Create game settings with sandbox mode enabled
            const gameSettings = params.gameSettings || new game_1.GameSettings();
            gameSettings.sandboxMode = true;
            // Create the game from the state with the opponent client
            const game = this.core.createGameFromState(this.client, state, gameSettings, opponentClient);
            response('ok', CoreSocket.buildGameState(game));
        }
        catch (error) {
            console.error('Error creating game from state:', error);
            response('error', errors_1.ApiErrorEnum.ACTION_INVALID);
        }
    }
    normalizeCardNamesInSerializedState(serializedState) {
        var _a;
        const parsed = JSON.parse(serializedState);
        const cardNames = (_a = parsed[1]) === null || _a === void 0 ? void 0 : _a.cardNames;
        if (Array.isArray(cardNames)) {
            parsed[1].cardNames = cardNames.map(name => game_1.StateSerializer.normalizeCardName(name));
        }
        return JSON.stringify(parsed);
    }
    static buildUserInfo(user, connected = true) {
        return {
            connected,
            userId: user.id,
            name: user.name,
            email: user.email,
            registered: user.registered,
            lastSeen: user.lastSeen,
            ranking: user.ranking,
            rank: user.getRank(),
            lastRankingChange: user.lastRankingChange,
            avatarFile: user.avatarFile,
            roleId: user.roleId
        };
    }
    static buildGameInfo(game) {
        const state = game.state;
        const players = state.players.map(player => ({
            clientId: player.id,
            name: player.name,
            prizes: player.prizes.reduce((sum, cardList) => sum + cardList.cards.length, 0),
            deck: player.deck.cards.length
        }));
        return {
            gameId: game.id,
            phase: state.phase,
            turn: state.turn,
            activePlayer: state.activePlayer,
            players: players
        };
    }
    static buildGameState(game) {
        const serializer = new game_1.StateSerializer();
        const serializedState = serializer.serialize(game.state);
        const stateObj = JSON.parse(serializedState);
        const finalSerializedState = JSON.stringify(stateObj);
        const base64 = new utils_2.Base64();
        const stateData = base64.encode(finalSerializedState);
        return {
            gameId: game.id,
            stateData,
            clientIds: game.clients.map(client => client.id),
            recordingEnabled: game.gameSettings.recordingEnabled,
            timeLimit: game.gameSettings.timeLimit,
            playerStats: game.playerStats,
            format: game.format
        };
    }
    dispose() {
        this.socket.removeListener('core:getInfo');
        this.socket.removeListener('core:createGame');
        this.socket.removeListener('core:createGameFromState');
    }
    isBotClient(client) {
        // Check if the client has bot-specific methods
        return 'isFormatAllowed' in client && 'getAllowedFormats' in client;
    }
}
exports.CoreSocket = CoreSocket;
