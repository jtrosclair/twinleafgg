"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoubleFullHeal = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class DoubleFullHeal extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'SS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '86';
        this.name = 'Double Full Heal';
        this.fullName = 'Double Full Heal SS';
        this.text = 'Remove all Special Conditions from each of your Active Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            effect.preventDefault = true;
            const conditions = player.active.specialConditions.slice();
            conditions === null || conditions === void 0 ? void 0 : conditions.forEach(condition => {
                player.active.removeSpecialCondition(condition);
            });
        }
        return state;
    }
}
exports.DoubleFullHeal = DoubleFullHeal;
