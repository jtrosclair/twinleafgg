"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WallysTrainingEM = exports.RareCandyEM = exports.MultiEnergyEM = exports.MetalEnergySpecialEM = exports.DoubleRainbowEnergyEM = exports.DarknessEnergySpecialEM = void 0;
const darkness_energy_special_1 = require("../set-ex-ruby-and-sapphire/darkness-energy-special");
const double_rainbow_energy_1 = require("../set-ex-team-magma-vs-team-aqua/double-rainbow-energy");
const metal_energy_special_1 = require("../set-undaunted/metal-energy-special");
const multi_energy_1 = require("../set-ex-sandstorm/multi-energy");
const rare_candy_1 = require("../set-ex-holon-phantoms/rare-candy");
const wallys_training_1 = require("../set-ex-sandstorm/wallys-training");
class DarknessEnergySpecialEM extends darkness_energy_special_1.DarknessEnergySpecial {
    constructor() {
        super(...arguments);
        this.setNumber = '86';
        this.fullName = 'Darkness Energy Special EM';
        this.set = 'EM';
    }
}
exports.DarknessEnergySpecialEM = DarknessEnergySpecialEM;
class DoubleRainbowEnergyEM extends double_rainbow_energy_1.DoubleRainbowEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = '87';
        this.fullName = 'Double Rainbow Energy EM';
        this.set = 'EM';
    }
}
exports.DoubleRainbowEnergyEM = DoubleRainbowEnergyEM;
class MetalEnergySpecialEM extends metal_energy_special_1.MetalEnergySpecial {
    constructor() {
        super(...arguments);
        this.setNumber = '88';
        this.fullName = 'Metal Energy Special EM';
        this.set = 'EM';
    }
}
exports.MetalEnergySpecialEM = MetalEnergySpecialEM;
class MultiEnergyEM extends multi_energy_1.MultiEnergy {
    constructor() {
        super(...arguments);
        this.setNumber = '89';
        this.fullName = 'Multi Energy EM';
        this.set = 'EM';
    }
}
exports.MultiEnergyEM = MultiEnergyEM;
class RareCandyEM extends rare_candy_1.RareCandy {
    constructor() {
        super(...arguments);
        this.setNumber = '83';
        this.fullName = 'Rare Candy EM';
        this.set = 'EM';
    }
}
exports.RareCandyEM = RareCandyEM;
class WallysTrainingEM extends wallys_training_1.WallysTraining {
    constructor() {
        super(...arguments);
        this.setNumber = '85';
        this.fullName = 'Wally\'s Training EM';
        this.set = 'EM';
    }
}
exports.WallysTrainingEM = WallysTrainingEM;
