"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NormaliumZTackle = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
class NormaliumZTackle extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'UNM';
        this.setNumber = '203';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Normalium Z: Tackle';
        this.fullName = 'Normalium Z: Tackle UNM';
        this.text = 'If the Pokémon this card is attached to has the Tackle attack, it can use the GX attack on this card. (You still need the necessary Energy to use this attack.)';
    }
    // TODO: Z-Crystal GX attack mechanic is not currently implementable in the engine.
    // This requires adding a GX attack to the attached Pokemon dynamically based on having the Tackle attack.
    reduceEffect(store, state, effect) {
        return state;
    }
}
exports.NormaliumZTackle = NormaliumZTackle;
