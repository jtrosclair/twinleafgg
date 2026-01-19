"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SandboxModifyPlayerAction = void 0;
class SandboxModifyPlayerAction {
    constructor(clientId, targetPlayerId, modifications) {
        this.clientId = clientId;
        this.targetPlayerId = targetPlayerId;
        this.modifications = modifications;
        this.type = 'SANDBOX_MODIFY_PLAYER';
    }
}
exports.SandboxModifyPlayerAction = SandboxModifyPlayerAction;
