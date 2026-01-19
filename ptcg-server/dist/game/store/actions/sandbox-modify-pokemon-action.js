"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SandboxModifyPokemonAction = void 0;
class SandboxModifyPokemonAction {
    constructor(clientId, targetPlayerId, location, modifications, benchIndex) {
        this.clientId = clientId;
        this.targetPlayerId = targetPlayerId;
        this.location = location;
        this.modifications = modifications;
        this.benchIndex = benchIndex;
        this.type = 'SANDBOX_MODIFY_POKEMON';
    }
}
exports.SandboxModifyPokemonAction = SandboxModifyPokemonAction;
