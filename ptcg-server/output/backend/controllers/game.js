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
                serializedState: serializedState,
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
    controller_1.Get('/:id/logs'),
    services_1.AuthToken(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Game.prototype, "onLogs", null);
__decorate([
    controller_1.Get('/:id/playerStats'),
    services_1.AuthToken(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Game.prototype, "onPlayerStats", null);
__decorate([
    controller_1.Post('/validate-state'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Game.prototype, "onValidateState", null);
exports.Game = Game;
