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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const services_1 = require("../services");
const controller_1 = require("./controller");
const errors_1 = require("../common/errors");
const base64_1 = require("../../utils/base64");
const state_serializer_1 = require("../../game/serializer/state-serializer");
const card_types_1 = require("../../game/store/card/card-types");
class Game extends controller_1.Controller {
    async onLogs(req, res) {
        const gameId = parseInt(req.params.id, 10);
        const game = this.core.games.find(g => g.id === gameId);
        if (game === undefined) {
            res.send({ error: errors_1.ApiErrorEnum.GAME_INVALID_ID });
            return;
        }
        const logs = game.state.logs;
        res.send({ ok: true, logs });
    }
    async onPlayerStats(req, res) {
        const gameId = parseInt(req.params.id, 10);
        const game = this.core.games.find(g => g.id === gameId);
        if (game === undefined) {
            res.send({ error: errors_1.ApiErrorEnum.GAME_INVALID_ID });
            return;
        }
        const playerStats = game.playerStats;
        res.send({ ok: true, playerStats });
    }
    async onValidateCards(req, res) {
        var _a;
        try {
            const { stateData } = req.body;
            if (!stateData || typeof stateData !== 'string') {
                res.status(400).send({
                    valid: false,
                    errors: ['stateData is required and must be a string']
                });
                return;
            }
            if (!state_serializer_1.StateSerializer.knownCards || state_serializer_1.StateSerializer.knownCards.length === 0) {
                res.status(500).send({
                    valid: false,
                    errors: ['Card database not initialized']
                });
                return;
            }
            const base64 = new base64_1.Base64();
            let decoded;
            try {
                decoded = base64.decode(stateData);
            }
            catch (e) {
                res.status(400).send({
                    valid: false,
                    errors: ['Failed to decode base64 string: ' + (e.message || 'Invalid base64')]
                });
                return;
            }
            let parsed;
            try {
                parsed = JSON.parse(decoded);
            }
            catch (e) {
                res.status(400).send({
                    valid: false,
                    errors: ['Failed to parse state JSON: ' + (e.message || 'Invalid JSON')]
                });
                return;
            }
            const cardNames = (_a = parsed[1]) === null || _a === void 0 ? void 0 : _a.cardNames;
            if (!Array.isArray(cardNames)) {
                res.status(400).send({
                    valid: false,
                    errors: ['Game state does not contain a cardNames array']
                });
                return;
            }
            const errors = [];
            for (const originalName of cardNames) {
                const normalized = state_serializer_1.StateSerializer.normalizeCardName(originalName);
                if (!normalized) {
                    errors.push(`Invalid Card: ${originalName}`);
                }
            }
            res.send({
                valid: errors.length === 0,
                errors
            });
        }
        catch (error) {
            res.status(500).send({
                valid: false,
                errors: [error.message || 'Unexpected error during validation']
            });
        }
    }
    async onExtractDecklists(req, res) {
        try {
            const { stateData } = req.body;
            if (!stateData || typeof stateData !== 'string') {
                res.status(400).send({
                    ok: false,
                    error: 'stateData is required and must be a string'
                });
                return;
            }
            if (!state_serializer_1.StateSerializer.knownCards || state_serializer_1.StateSerializer.knownCards.length === 0) {
                res.status(500).send({
                    ok: false,
                    error: 'Card database not initialized'
                });
                return;
            }
            const base64 = new base64_1.Base64();
            let serializedState;
            try {
                serializedState = base64.decode(stateData);
            }
            catch (e) {
                res.status(400).send({
                    ok: false,
                    error: 'Failed to decode base64 string: ' + (e.message || 'Invalid base64')
                });
                return;
            }
            try {
                const parsed = JSON.parse(serializedState);
                if (parsed[1] && Array.isArray(parsed[1].cardNames)) {
                    parsed[1].cardNames = parsed[1].cardNames.map((name) => {
                        name = name.replace('é', 'e');
                        const normalizedName = state_serializer_1.StateSerializer.normalizeCardName(name);
                        return normalizedName || name;
                    });
                    serializedState = JSON.stringify(parsed);
                }
            }
            catch (e) {
                res.status(400).send({
                    ok: false,
                    error: 'Failed to parse state JSON: ' + (e.message || 'Invalid JSON')
                });
                return;
            }
            const serializer = new state_serializer_1.StateSerializer();
            const state = serializer.deserialize(serializedState);
            const decklists = state.players.map((player, index) => ({
                playerIndex: index,
                playerName: player.name,
                decklist: this.formatDecklist(this.collectAllCards(player))
            }));
            res.send({ ok: true, decklists });
        }
        catch (error) {
            res.status(400).send({
                ok: false,
                error: error.message || 'Failed to extract decklists'
            });
        }
    }
    collectAllCards(player) {
        const cards = [];
        const seen = new Set();
        const addCards = (cardArray) => {
            for (const card of cardArray) {
                if (!seen.has(card)) {
                    seen.add(card);
                    cards.push(card);
                }
            }
        };
        // Standard zones
        addCards(player.deck.cards);
        addCards(player.hand.cards);
        addCards(player.discard.cards);
        addCards(player.lostzone.cards);
        addCards(player.stadium.cards);
        addCards(player.supporter.cards);
        // Active pokemon slot
        addCards(player.active.cards);
        addCards(player.active.tools);
        addCards(player.active.energies.cards);
        // Bench slots
        for (const benchSlot of player.bench) {
            addCards(benchSlot.cards);
            addCards(benchSlot.tools);
            addCards(benchSlot.energies.cards);
        }
        // Prize cards
        for (const prizeStack of player.prizes) {
            addCards(prizeStack.cards);
        }
        return cards;
    }
    formatDecklist(cards) {
        const counts = new Map();
        for (const card of cards) {
            const key = `${card.fullName}`;
            const existing = counts.get(key);
            if (existing) {
                existing.count++;
            }
            else {
                counts.set(key, {
                    count: 1,
                    name: card.name,
                    set: card.set,
                    setNumber: card.setNumber,
                    superType: card.superType
                });
            }
        }
        const pokemon = [];
        const trainer = [];
        const energy = [];
        let pokemonCount = 0;
        let trainerCount = 0;
        let energyCount = 0;
        Array.from(counts.values()).forEach(entry => {
            const line = `${entry.count} ${entry.name} ${entry.set} ${entry.setNumber}`;
            switch (entry.superType) {
                case card_types_1.SuperType.POKEMON:
                    pokemon.push(line);
                    pokemonCount += entry.count;
                    break;
                case card_types_1.SuperType.TRAINER:
                    trainer.push(line);
                    trainerCount += entry.count;
                    break;
                case card_types_1.SuperType.ENERGY:
                    energy.push(line);
                    energyCount += entry.count;
                    break;
            }
        });
        const sections = [];
        if (pokemon.length > 0) {
            sections.push(`Pokémon: ${pokemonCount}\n${pokemon.join('\n')}`);
        }
        if (trainer.length > 0) {
            sections.push(`Trainer: ${trainerCount}\n${trainer.join('\n')}`);
        }
        if (energy.length > 0) {
            sections.push(`Energy: ${energyCount}\n${energy.join('\n')}`);
        }
        return sections.join('\n\n');
    }
    async onValidateState(req, res) {
        try {
            const { stateData } = req.body;
            if (!stateData || typeof stateData !== 'string') {
                res.status(400).send({
                    ok: false,
                    valid: false,
                    error: 'INVALID_REQUEST',
                    message: 'stateData is required and must be a string'
                });
                return;
            }
            // Check if known cards are initialized
            if (!state_serializer_1.StateSerializer.knownCards || state_serializer_1.StateSerializer.knownCards.length === 0) {
                res.status(500).send({
                    ok: false,
                    valid: false,
                    error: 'SERVER_NOT_READY',
                    message: 'Card database not initialized'
                });
                return;
            }
            // Attempt to decode and deserialize the state
            const base64 = new base64_1.Base64();
            let serializedState;
            try {
                serializedState = base64.decode(stateData);
            }
            catch (decodeError) {
                res.status(400).send({
                    ok: false,
                    valid: false,
                    error: 'INVALID_BASE64',
                    message: 'Failed to decode base64 string: ' + (decodeError.message || 'Invalid base64')
                });
                return;
            }
            // Preprocess the card names by normalizing them before deserialization
            try {
                const parsed = JSON.parse(serializedState);
                if (parsed[1] && Array.isArray(parsed[1].cardNames)) {
                    parsed[1].cardNames = parsed[1].cardNames.map((name) => {
                        name = name.replace("é", 'e');
                        console.log({ name });
                        const normalizedName = state_serializer_1.StateSerializer.normalizeCardName(name);
                        // If normalization returns empty string, keep the original name
                        // to let the deserializer produce a proper error message
                        return normalizedName || name;
                    });
                    serializedState = JSON.stringify(parsed);
                }
            }
            catch (parseError) {
                res.status(400).send({
                    ok: false,
                    valid: false,
                    error: 'INVALID_JSON',
                    message: 'Failed to parse state JSON: ' + (parseError.message || 'Invalid JSON')
                });
                return;
            }
            const serializer = new state_serializer_1.StateSerializer();
            const state = serializer.deserialize(serializedState);
            // If we reach here without errors, the state is valid
            res.send({
                ok: true,
                valid: true,
                serializedState: btoa(serializedState),
                info: {
                    turn: state.turn,
                    phase: state.phase,
                    playerCount: state.players.length,
                    state: state
                }
            });
        }
        catch (error) {
            // If deserialization fails, the state is invalid
            // Check if it's a card-related error
            const errorMessage = error.message || 'Failed to deserialize game state';
            const isCardError = errorMessage.includes('Unknown card');
            res.status(400).send({
                ok: false,
                valid: false,
                error: isCardError ? 'UNKNOWN_CARD' : 'INVALID_STATE',
                message: errorMessage
            });
        }
    }
}
__decorate([
    (0, controller_1.Get)('/:id/logs'),
    (0, services_1.AuthToken)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Game.prototype, "onLogs", null);
__decorate([
    (0, controller_1.Get)('/:id/playerStats'),
    (0, services_1.AuthToken)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Game.prototype, "onPlayerStats", null);
__decorate([
    (0, controller_1.Post)('/validate-cards'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Game.prototype, "onValidateCards", null);
__decorate([
    (0, controller_1.Post)('/extract-decklists'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Game.prototype, "onExtractDecklists", null);
__decorate([
    (0, controller_1.Post)('/validate-state'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Game.prototype, "onValidateState", null);
exports.Game = Game;
