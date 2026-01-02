"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PikachuRR = exports.MetalEnergyN1RR = exports.DarknessEnergySpecialRR = exports.BebesSearchRR = void 0;
const bebes_search_1 = require("../set-mysterious-treasures/bebes-search");
const darkness_energy_special_1 = require("../set-neo-genesis/darkness-energy-special");
const other_prints_1 = require("../set-neo-genesis/other-prints");
const pikachu_1 = require("../set-base-set/pikachu");
class BebesSearchRR extends bebes_search_1.BebesSearch {
    constructor() {
        super(...arguments);
        this.setNumber = '89';
        this.fullName = 'Bebe\'s Search RR';
        this.set = 'RR';
    }
}
exports.BebesSearchRR = BebesSearchRR;
class DarknessEnergySpecialRR extends darkness_energy_special_1.DarknessEnergySpecial {
    constructor() {
        super(...arguments);
        this.setNumber = '99';
        this.fullName = 'Darkness Energy RR';
        this.set = 'RR';
    }
}
exports.DarknessEnergySpecialRR = DarknessEnergySpecialRR;
class MetalEnergyN1RR extends other_prints_1.MetalEnergyN1 {
    constructor() {
        super(...arguments);
        this.setNumber = '100';
        this.fullName = 'Metal Energy RR';
        this.set = 'RR';
    }
}
exports.MetalEnergyN1RR = MetalEnergyN1RR;
class PikachuRR extends pikachu_1.Pikachu {
    constructor() {
        super(...arguments);
        this.setNumber = '112';
        this.fullName = 'Pikachu RR';
        this.set = 'RR';
    }
}
exports.PikachuRR = PikachuRR;
