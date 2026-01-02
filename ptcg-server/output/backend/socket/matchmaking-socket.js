"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchmakingSocket = void 0;
const errors_1 = require("../common/errors");
const matchmaking_service_1 = require("../services/matchmaking.service");
class MatchmakingSocket {
    constructor(client, socket, core) {
        this.client = client;
        this.socket = socket;
        this.core = core;
        this.matchmakingService = matchmaking_service_1.MatchmakingService.getInstance(this.core);
        this.socket.addListener('matchmaking:join', this.joinQueue.bind(this));
        this.socket.addListener('matchmaking:leave', this.leaveQueue.bind(this));
        this.socket.addListener('matchmaking:getQueueData', this.getQueueData.bind(this));
    }
    onJoinQueue(from, message) {
        this.socket.emit('matchmaking:playerJoined', {
            player: from.user.name
        });
    }
    onLeaveQueue() {
        // The matchmaking service will handle broadcasting to all clients
        // No need to emit here since broadcastQueueUpdate() is called by the service
    }
    getQueueData(response) {
        response('ok', {
            players: this.matchmakingService.getQueuedPlayers(),
            formatCounts: this.matchmakingService.getQueueCountsByFormat()
        });
    }
    joinQueue(params, response) {
        if (!params || !params.format || !Array.isArray(params.deck) || params.deck.length === 0) {
            response('error', errors_1.ApiErrorEnum.INVALID_FORMAT);
            return;
        }
        this.matchmakingService.addToQueue(this.client, this.socket, params.format, params.deck, params.artworks, params.deckId);
        response('ok');
    }
    leaveQueue(_params, response) {
        if (this.matchmakingService.isPlayerInQueue(this.client)) {
            this.matchmakingService.removeFromQueue(this.client);
        }
        response('ok');
    }
    dispose() {
        if (this.matchmakingService.isPlayerInQueue(this.client)) {
            this.matchmakingService.removeFromQueue(this.client);
        }
        this.socket.removeListener('matchmaking:join');
        this.socket.removeListener('matchmaking:leave');
    }
}
exports.MatchmakingSocket = MatchmakingSocket;
