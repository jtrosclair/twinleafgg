"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FullHeal = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class FullHeal extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'EX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '154';
        this.name = 'Full Heal';
        this.fullName = 'Full Heal EX';
        this.text = 'Remove all Special Conditions from your Active Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            effect.preventDefault = true;
            const conditions = player.active.specialConditions.slice();
            conditions === null || conditions === void 0 ? void 0 : conditions.forEach(condition => {
                player.active.removeSpecialCondition(condition);
            });
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
        return state;
    }
}
exports.FullHeal = FullHeal;
