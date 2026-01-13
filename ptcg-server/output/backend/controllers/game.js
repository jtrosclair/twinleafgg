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
            // Attempt to decode and deserialize the state
            const base64 = new base64_1.Base64();
            const serializedState = base64.decode(stateData);
            const serializer = new state_serializer_1.StateSerializer();
            const state = serializer.deserialize(serializedState);
            // If we reach here without errors, the state is valid
            res.send({
                ok: true,
                valid: true,
                info: {
                    turn: state.turn,
                    phase: state.phase,
                    playerCount: state.players.length
                }
            });
        }
        catch (error) {
            // If deserialization fails, the state is invalid
            res.status(400).send({
                ok: false,
                valid: false,
                error: 'INVALID_STATE',
                message: error.message || 'Failed to deserialize game state'
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
