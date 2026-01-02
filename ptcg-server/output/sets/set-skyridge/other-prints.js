"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FishermanSK = void 0;
const fisherman_1 = require("../set-celestial-storm/fisherman");
class FishermanSK extends fisherman_1.Fisherman {
    constructor() {
        super(...arguments);
        this.fullName = 'Fisherman SK';
        this.set = 'SK';
        this.setNumber = '125';
        this.text = 'Choose 4 basic Energy cards from your discard pile (if there are fewer basic Energy cards than choose, take all of them), show them to your opponent, and put them into your hand.';
    }
}
exports.FishermanSK = FishermanSK;
