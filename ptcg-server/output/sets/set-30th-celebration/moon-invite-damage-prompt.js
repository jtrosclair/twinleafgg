"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoonInviteDamagePrompt = void 0;
const move_damage_prompt_1 = require("../../game/store/prompts/move-damage-prompt");
const state_utils_1 = require("../../game/store/state-utils");
// Card-local strengthening: the generic prompt validates sides/slots but not
// occupied targets, distinct source/destination, or available source counters.
class MoonInviteDamagePrompt extends move_damage_prompt_1.MoveDamagePrompt {
    validate(result, state) {
        if (!super.validate(result, state)) {
            return false;
        }
        if (result === null) {
            return true;
        }
        const player = state.players.find(p => p.id === this.playerId);
        const outgoing = new Map();
        for (const transfer of result) {
            const from = state_utils_1.StateUtils.getTarget(state, player, transfer.from);
            const to = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
            if (from === to || !from.getPokemonCard() || !to.getPokemonCard()) {
                return false;
            }
            outgoing.set(from, (outgoing.get(from) || 0) + 10);
        }
        return Array.from(outgoing).every(([from, damage]) => damage <= from.damage);
    }
}
exports.MoonInviteDamagePrompt = MoonInviteDamagePrompt;
