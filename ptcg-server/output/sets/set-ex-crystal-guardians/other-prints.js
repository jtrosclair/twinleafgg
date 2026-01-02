"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PotionCG = void 0;
const potion_1 = require("../set-base-set/potion");
class PotionCG extends potion_1.Potion {
    constructor() {
        super(...arguments);
        this.fullName = 'Potion CG';
        this.set = 'CG';
        this.setNumber = '87';
        this.text = 'Remove 2 damage counters from 1 of your Pokémon (remove 1 damage counter if that Pokémon has only 1).';
    }
}
exports.PotionCG = PotionCG;
