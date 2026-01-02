"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchRecorder = void 0;
const typeorm_1 = require("typeorm");
const state_1 = require("../store/state/state");
const storage_1 = require("../../storage");
const ranking_calculator_1 = require("./ranking-calculator");
const replay_1 = require("./replay");
class MatchRecorder {
    constructor(core) {
        this.core = core;
        this.finished = false;
        this.TRANSACTION_TIMEOUT_MS = 30000; // 30 seconds
        this.ranking = new ranking_calculator_1.RankingCalculator();
        this.replay = new replay_1.Replay({ indexEnabled: false });
    }
    onStateChange(state) {
        if (this.finished) {
            return;
        }
        if (state.players.length >= 2) {
            this.updateClients(state);
        }
        if (state.phase !== state_1.GamePhase.WAITING_FOR_PLAYERS) {
            this.replay.appendState(state);
        }
        if (state.phase === state_1.GamePhase.FINISHED) {
            this.finished = true;
            if (state.winner !== state_1.GameWinner.NONE) {
                this.saveMatch(state);
            }
            else {
                this.cleanup();
            }
        }
    }
    async saveMatch(state, manager) {
        if (!this.client1 || !this.client2 || manager === undefined) {
            this.cleanup();
            return;
        }
        try {
            // Set transaction timeout
            this.transactionTimeout = setTimeout(() => {
                console.error('[MatchRecorder] Transaction timeout after', this.TRANSACTION_TIMEOUT_MS, 'ms');
                this.cleanup();
            }, this.TRANSACTION_TIMEOUT_MS);
            const match = new storage_1.Match();
            match.player1 = this.client1.user;
            match.player2 = this.client2.user;
            match.winner = state.winner;
            match.created = Date.now();
            match.ranking1 = match.player1.ranking;
            match.ranking2 = match.player2.ranking;
            match.rankingStake1 = 0;
            match.rankingStake2 = 0;
            // Store archetype information based on deck analysis
            const player1Archetypes = await this.getPlayerArchetypes(state.players[0]);
            const player2Archetypes = await this.getPlayerArchetypes(state.players[1]);
            match.player1Archetype = player1Archetypes.primary;
            match.player1Archetype2 = player1Archetypes.secondary || '';
            match.player2Archetype = player2Archetypes.primary;
            match.player2Archetype2 = player2Archetypes.secondary || '';
            match.player1DeckName = `Deck ${match.player1.id}`;
            match.player2DeckName = `Deck ${match.player2.id}`;
            match.player1DeckId = state.players[0].deckId || null;
            match.player2DeckId = state.players[1].deckId || null;
            this.replay.setCreated(match.created);
            this.replay.player1 = this.buildReplayPlayer(match.player1);
            this.replay.player2 = this.buildReplayPlayer(match.player2);
            this.replay.winner = match.winner;
            match.replayData = ''; // this.replay.serialize();
            // Update ranking
            const users = this.ranking.calculateMatch(match, state);
            // Update match's ranking
            if (users.length >= 2) {
                match.rankingStake1 = users[0].ranking - match.ranking1;
                match.ranking1 = users[0].ranking;
                match.rankingStake2 = users[1].ranking - match.ranking2;
                match.ranking2 = users[1].ranking;
            }
            //await manager.save(match);
            if (users.length >= 2) {
                for (const user of users) {
                    const update = { ranking: user.ranking, lastRankingChange: user.lastRankingChange };
                    await manager.update(storage_1.User, user.id, update);
                }
                this.core.emit(c => c.onUsersUpdate(users));
            }
        }
        catch (error) {
            console.error('[MatchRecorder] Error saving match:', error);
        }
        finally {
            if (this.transactionTimeout) {
                clearTimeout(this.transactionTimeout);
            }
            this.cleanup();
        }
    }
    cleanup() {
        this.finished = true;
        this.client1 = undefined;
        this.client2 = undefined;
        if (this.transactionTimeout) {
            clearTimeout(this.transactionTimeout);
            this.transactionTimeout = undefined;
        }
        this.replay = new replay_1.Replay({ indexEnabled: false });
    }
    updateClients(state) {
        const player1Id = state.players[0].id;
        const player2Id = state.players[1].id;
        if (this.client1 === undefined) {
            this.client1 = this.findClient(player1Id);
        }
        if (this.client2 === undefined) {
            this.client2 = this.findClient(player2Id);
        }
    }
    findClient(clientId) {
        return this.core.clients.find(c => c.id === clientId);
    }
    buildReplayPlayer(player) {
        return { userId: player.id, name: player.name, ranking: player.ranking };
    }
    async getPlayerArchetypes(player) {
        // First, check if we have a deckId and can get manual archetype from deck
        if (player.deckId) {
            try {
                const deck = await storage_1.Deck.findOne(player.deckId);
                if (deck) {
                    // Use manual archetypes if set, otherwise fall through to auto-detection
                    if (deck.manualArchetype1) {
                        return {
                            primary: deck.manualArchetype1,
                            secondary: deck.manualArchetype2 || undefined
                        };
                    }
                }
            }
            catch (error) {
                // If we can't load the deck, fall through to auto-detection
                console.error('[MatchRecorder] Error loading deck for archetype:', error);
            }
        }
        // Analyze the player's deck to determine archetype
        // For now, we'll use a simple approach based on the most common Pokemon in the deck
        const deckCards = player.deck.cards || [];
        if (deckCards.length === 0) {
            return { primary: 'UNKNOWN' };
        }
        // Count Pokemon cards and their types
        const pokemonCounts = {};
        const typeCounts = {};
        deckCards.forEach((card) => {
            if (card && card.name) {
                // Count Pokemon cards - check if cardType is a string or enum
                const isPokemon = card.cardType && ((typeof card.cardType === 'string' && card.cardType.includes('POKEMON')) ||
                    (typeof card.cardType === 'number' && card.cardType === 1) // Assuming 1 = POKEMON
                );
                if (isPokemon) {
                    pokemonCounts[card.name] = (pokemonCounts[card.name] || 0) + 1;
                    // Count by Pokemon type for archetype detection
                    if (card.name.includes('Pikachu')) {
                        typeCounts['Pikachu'] = (typeCounts['Pikachu'] || 0) + 1;
                    }
                    else if (card.name.includes('Charizard')) {
                        typeCounts['Charizard'] = (typeCounts['Charizard'] || 0) + 1;
                    }
                    else if (card.name.includes('Arceus')) {
                        typeCounts['Arceus'] = (typeCounts['Arceus'] || 0) + 1;
                    }
                    else if (card.name.includes('Giratina')) {
                        typeCounts['Giratina'] = (typeCounts['Giratina'] || 0) + 1;
                    }
                    else if (card.name.includes('Comfey')) {
                        typeCounts['Comfey'] = (typeCounts['Comfey'] || 0) + 1;
                    }
                    else if (card.name.includes('Raging Bolt')) {
                        typeCounts['Raging Bolt'] = (typeCounts['Raging Bolt'] || 0) + 1;
                    }
                    else if (card.name.includes('Pidgeot')) {
                        typeCounts['Pidgeot'] = (typeCounts['Pidgeot'] || 0) + 1;
                    }
                }
            }
        });
        // Determine archetype based on most common Pokemon
        const sortedTypes = Object.entries(typeCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([pokemon]) => pokemon.toUpperCase().replace(/\s+/g, '_'));
        let primary = 'UNKNOWN';
        let secondary = undefined;
        if (sortedTypes.length > 0) {
            primary = sortedTypes[0];
            if (sortedTypes.length > 1) {
                secondary = sortedTypes[1];
            }
        }
        // Fallback to common archetypes if no specific Pokemon found
        if (primary === 'UNKNOWN') {
            const commonArchetypes = ['PIKACHU', 'CHARIZARD', 'ARCEUS', 'GIRATINA', 'COMFEY'];
            const randomIndex = Math.floor(Math.random() * commonArchetypes.length);
            primary = commonArchetypes[randomIndex];
        }
        return { primary, secondary };
    }
}
__decorate([
    typeorm_1.Transaction(),
    __param(1, typeorm_1.TransactionManager()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [state_1.State, typeorm_1.EntityManager]),
    __metadata("design:returntype", Promise)
], MatchRecorder.prototype, "saveMatch", null);
exports.MatchRecorder = MatchRecorder;
