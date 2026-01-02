"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalacticHQ = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
class GalacticHQ extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'PL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '106';
        this.name = 'Galactic HQ';
        this.fullName = 'Galactic HQ PL';
        this.text = 'Whenever any player plays any Pokémon from his or her hand to evolve his or her Pokémon, put 2 damage counters on that Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        if (effect instanceof game_effects_1.EvolveEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            effect.target.damage += 20;
        }
        return state;
    }
}
exports.GalacticHQ = GalacticHQ;
