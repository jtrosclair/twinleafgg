"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResistanceGym = void 0;
const game_1 = require("../../game");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class ResistanceGym extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'G2';
        this.setNumber = '109';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Resistance Gym';
        this.fullName = 'Resistance Gym G2';
        this.text = 'Each Pokémon\'s Resistance is reduced by 20. (If a Pokémon\'s Resistance is -30, it becomes -10.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckPokemonStatsEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            // honestly don't understand this, but the AI cooked
            const target = effect.target.getPokemonCard();
            if (target && Array.isArray(target.resistance)) {
                // Reduce each resistance value by 20, but not below -10
                effect.resistance = target.resistance.map(res => {
                    // If resistance is a number, reduce by 20, min -10
                    if (typeof res.value === 'number') {
                        return Object.assign(Object.assign({}, res), { value: Math.min(res.value + 20, 0) });
                    }
                    return res;
                });
            }
            if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_STADIUM);
            }
        }
        return state;
    }
}
exports.ResistanceGym = ResistanceGym;
