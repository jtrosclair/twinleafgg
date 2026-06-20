"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryBadge = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
class RetryBadge extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'M5';
        this.setNumber = '74';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Retry Badge';
        this.fullName = 'Retry Badge M5';
        this.text = 'Once during your turn, after you flip any coins for an attack of the [C] Pokémon this card is attached to, you may ignore the results of those coin flips and begin flipping those coins again.';
    }
    reduceEffect(_store, state, _effect) {
        return state;
    }
}
exports.RetryBadge = RetryBadge;
