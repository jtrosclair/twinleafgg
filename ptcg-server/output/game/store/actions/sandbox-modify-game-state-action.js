"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SandboxModifyGameStateAction = void 0;
class SandboxModifyGameStateAction {
    constructor(clientId, modifications) {
        this.clientId = clientId;
        this.modifications = modifications;
        this.type = 'SANDBOX_MODIFY_GAME_STATE';
    }
}
exports.SandboxModifyGameStateAction = SandboxModifyGameStateAction;
