"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GardevoirSpiritLink = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
class GardevoirSpiritLink extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'PRC';
        this.name = 'Gardevoir Spirit Link';
        this.fullName = 'Gardevoir Spirit Link PRC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '130';
        this.text = 'Your turn does not end if the Pokémon this card is attached to becomes M Gardevoir-EX.';
    }
    reduceEffect(store, state, effect) {
        // aw yes look at this amazing effect i got cooking up here this is going to break the expanded meta into a million different pieces watch this
        return state;
    }
}
exports.GardevoirSpiritLink = GardevoirSpiritLink;
