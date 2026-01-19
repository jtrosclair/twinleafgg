"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcedeAction = void 0;
class ConcedeAction {
    constructor(playerId) {
        this.playerId = playerId;
        this.type = 'CONCEDE_GAME';
    }
}
exports.ConcedeAction = ConcedeAction;
