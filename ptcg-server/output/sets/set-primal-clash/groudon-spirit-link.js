"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroudonSpiritLink = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
class GroudonSpiritLink extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'PRC';
        this.name = 'Groudon Spirit Link';
        this.fullName = 'Groudon Spirit Link PRC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '131';
        this.text = 'Your turn does not end if the Pokémon this card is attached to becomes Primal Groudon-EX.';
    }
    reduceEffect(store, state, effect) {
        // aw yes look at this amazing effect i got cooking up here this is going to break the expanded meta into a million different pieces watch this
        return state;
    }
}
exports.GroudonSpiritLink = GroudonSpiritLink;
