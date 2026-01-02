"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchmakingService = void 0;
const game_1 = require("../../game");
const storage_1 = require("../../storage");
const typeorm_1 = require("typeorm");
class MatchmakingService {
    constructor(core) {
        this.core = core;
        this.queue = [];
        this.CHECK_INTERVAL = 2000; // Check for matches every 2 seconds
        this.VALIDATE_INTERVAL = 30000; // Validate connections every 30 seconds
        this.BROADCAST_INTERVAL = 10000; // Broadcast queue updates every 10 seconds
        this.MAX_QUEUE_TIME = 300000; // 5 minutes maximum in queue
        this.matchCheckInterval = setInterval(() => this.checkMatches(), this.CHECK_INTERVAL);
        this.validateInterval = setInterval(() => this.validateQueue(), this.VALIDATE_INTERVAL);
        this.broadcastInterval = setInterval(() => this.broadcastQueueUpdate(), this.BROADCAST_INTERVAL);
    }
    static getInstance(core) {
        if (!MatchmakingService.instance) {
            MatchmakingService.instance = new MatchmakingService(core);
        }
        return MatchmakingService.instance;
    }
    addToQueue(client, socketWrapper, format, deck, artworks, deckId) {
        // Remove if already in queue
        this.removeFromQueue(client);
        // Validate deck before adding to queue
        if (!Array.isArray(deck) || deck.length === 0) {
            throw new Error('Invalid deck');
        }
        this.queue.push({
            client,
            socketWrapper,
            format,
            deck,
            artworks,
            deckId,
            joinedAt: Date.now(),
            lastValidated: Date.now()
        });
        this.broadcastQueueUpdate();
    }
    removeFromQueue(client) {
        const wasInQueue = this.queue.some(p => p.client === client);
        this.queue = this.queue.filter(p => p.client !== client);
        if (wasInQueue) {
            this.broadcastQueueUpdate();
        }
    }
    getQueuedPlayers() {
        return this.queue.map(p => p.client.name);
    }
    getQueueCountsByFormat() {
        const counts = {};
        this.queue.forEach(player => {
            counts[player.format] = (counts[player.format] || 0) + 1;
        });
        return counts;
    }
    isPlayerInQueue(client) {
        return this.queue.some(p => p.client === client);
    }
    broadcastQueueUpdate() {
        const players = this.getQueuedPlayers();
        const formatCounts = this.getQueueCountsByFormat();
        // Broadcast to all connected clients, not just those in queue
        this.core.clients.forEach(client => {
            // Cast to SocketClient to access socket property
            const socketClient = client;
            if (socketClient.socket) {
                socketClient.socket.emit('matchmaking:queueUpdate', {
                    players,
                    formatCounts
                });
            }
        });
    }
    validateQueue() {
        const now = Date.now();
        const playersToRemove = [];
        // Check for stale connections or players who have been in queue too long
        this.queue.forEach(player => {
            // Remove if in queue too long
            if (now - player.joinedAt > this.MAX_QUEUE_TIME) {
                playersToRemove.push(player.client);
                return;
            }
            // Validate socket is still connected
            const isConnected = player.socketWrapper.socket.connected;
            if (!isConnected) {
                playersToRemove.push(player.client);
            }
            else {
                player.lastValidated = now;
            }
        });
        // Remove invalid players
        playersToRemove.forEach(client => {
            this.removeFromQueue(client);
        });
        // Send queue update if players were removed
        if (playersToRemove.length > 0) {
            this.broadcastQueueUpdate();
        }
    }
    async checkMatches() {
        if (this.queue.length < 2)
            return;
        // Group players by format
        const formatGroups = new Map();
        this.queue.forEach(player => {
            const players = formatGroups.get(player.format) || [];
            players.push(player);
            formatGroups.set(player.format, players);
        });
        // Check each format group for potential matches
        for (const players of formatGroups.values()) {
            if (players.length < 2)
                return;
            // Sort by time in queue
            players.sort((a, b) => a.joinedAt - b.joinedAt);
            // Match first two players
            const player1 = players[0];
            const player2 = players[1];
            // Verify both players are still connected and in the core
            const isPlayer1Connected = player1.socketWrapper.socket.connected &&
                this.core.clients.some(c => c.id === player1.client.id);
            const isPlayer2Connected = player2.socketWrapper.socket.connected &&
                this.core.clients.some(c => c.id === player2.client.id);
            if (!isPlayer1Connected || !isPlayer2Connected) {
                // Remove disconnected players
                if (!isPlayer1Connected) {
                    console.log(`[Matchmaking] Removing disconnected player ${player1.client.name} from queue`);
                    this.removeFromQueue(player1.client);
                }
                if (!isPlayer2Connected) {
                    console.log(`[Matchmaking] Removing disconnected player ${player2.client.name} from queue`);
                    this.removeFromQueue(player2.client);
                }
                return;
            }
            try {
                // Create game settings
                const gameSettings = {
                    format: player1.format,
                    timeLimit: 1800,
                    rules: new game_1.Rules(),
                    recordingEnabled: true,
                    sandboxMode: false
                };
                console.log(`[Matchmaking] Creating game between ${player1.client.name} and ${player2.client.name}`);
                // Build artwork maps for both players
                const map1 = await this.buildArtworksMap(player1.artworks);
                const map2 = await this.buildArtworksMap(player2.artworks);
                // Use createGameWithDecks instead of createGame
                const game = this.core.createGameWithDecks(player1.client, player1.deck, gameSettings, player2.client, player2.deck, map1, map2, player1.deckId, player2.deckId);
                if (game) {
                    console.log(`[Matchmaking] Game ${game.id} created successfully`);
                    // Notify players
                    console.log(`[Matchmaking] Notifying ${player1.client.name} about game ${game.id}`);
                    player1.socketWrapper.emit('matchmaking:gameCreated', { gameId: game.id });
                    console.log(`[Matchmaking] Notifying ${player2.client.name} about game ${game.id}`);
                    player2.socketWrapper.emit('matchmaking:gameCreated', { gameId: game.id });
                    // Remove matched players from queue
                    this.removeFromQueue(player1.client);
                    this.removeFromQueue(player2.client);
                }
                else {
                    console.log(`[Matchmaking] Failed to create game between ${player1.client.name} and ${player2.client.name}`);
                    // Remove players from queue if there was an error
                    this.removeFromQueue(player1.client);
                    this.removeFromQueue(player2.client);
                }
            }
            catch (error) {
                console.error(`[Matchmaking] Error creating game: ${error}`);
                // Remove players from queue if there was an error
                this.removeFromQueue(player1.client);
                this.removeFromQueue(player2.client);
            }
        }
    }
    async buildArtworksMap(artworks) {
        const map = {};
        if (!artworks || artworks.length === 0)
            return map;
        const ids = artworks.map(a => a.artworkId).filter((v) => typeof v === 'number');
        if (ids.length === 0)
            return map;
        const rows = await storage_1.CardArtwork.find({ where: { id: typeorm_1.In(ids) } });
        const byId = new Map(rows.map(r => [r.id, r]));
        for (const a of artworks) {
            if (!a.artworkId)
                continue;
            const row = byId.get(a.artworkId);
            if (row) {
                map[a.code] = { imageUrl: row.imageUrl, holoType: row.holoType };
            }
        }
        return map;
    }
    dispose() {
        if (this.matchCheckInterval) {
            clearInterval(this.matchCheckInterval);
        }
        if (this.validateInterval) {
            clearInterval(this.validateInterval);
        }
        if (this.broadcastInterval) {
            clearInterval(this.broadcastInterval);
        }
        // Clear queue on dispose
        this.queue = [];
    }
}
exports.MatchmakingService = MatchmakingService;
