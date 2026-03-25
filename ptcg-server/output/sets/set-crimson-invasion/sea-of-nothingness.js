"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeaOfNothingness = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class SeaOfNothingness extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'CIN';
        this.name = 'Sea of Nothingness';
        this.fullName = 'Sea of Nothingness CIN';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '99';
        this.text = 'Special Conditions are not removed when Pokémon (both yours and your opponent\'s) evolve or devolve.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckSpecialConditionRemovalEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            // Add all special conditions that the target has to the preserved list
            effect.target.specialConditions.forEach(condition => {
                if (!effect.preservedConditions.includes(condition)) {
                    effect.preservedConditions.push(condition);
                }
            });
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.SeaOfNothingness = SeaOfNothingness;
