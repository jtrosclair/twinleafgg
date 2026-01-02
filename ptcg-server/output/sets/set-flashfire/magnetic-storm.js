"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagneticStorm = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class MagneticStorm extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'FLF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '91';
        this.name = 'Magnetic Storm';
        this.fullName = 'Magnetic Storm FLF';
        this.text = 'Each Pokémon in play has no Resistance.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        if (effect instanceof check_effects_1.CheckPokemonStatsEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            effect.resistance = [];
        }
        return state;
    }
}
exports.MagneticStorm = MagneticStorm;
