"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoTown = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
class PoTown extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'BUS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '121';
        this.name = 'Po Town';
        this.fullName = 'Po Town BUS';
        this.text = 'Whenever any player plays a Pokémon from their hand to evolve 1 of their Pokémon, put 3 damage counters on that Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        if (effect instanceof game_effects_1.EvolveEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            effect.target.damage += 30;
        }
        return state;
    }
}
exports.PoTown = PoTown;
