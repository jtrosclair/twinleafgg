"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LilliesPearl = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const state_1 = require("../../game/store/state/state");
const state_utils_1 = require("../../game/store/state-utils");
class LilliesPearl extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.regulationMark = 'I';
        this.set = 'JTG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '151';
        this.name = 'Lillie\'s Pearl';
        this.fullName = 'Lillie\'s Pearl JTG';
        this.text = 'If the Lillie\'s Pokémon this card is attached to is Knocked Out by damage from an attack from your opponent\'s Pokémon, that player takes 1 fewer Prize card.';
    }
    // public damageDealt = false;
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.tools.includes(this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Pearl only works if knocked out by attack damage, not by other effects like damage counters
            if (state.phase !== state_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            if ((0, prefabs_1.IS_TOOL_BLOCKED)(store, state, player, this)) {
                return state;
            }
            if (effect.target.isLillies()) {
                effect.prizeCount -= 1;
            }
            return state;
        }
        return state;
    }
}
exports.LilliesPearl = LilliesPearl;
