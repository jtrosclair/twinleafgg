"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PotionDP = exports.EnergySearchDP = exports.WarpPointG2DP = exports.PokeBallDP = exports.EnergySwitchPKDP = exports.SwitchDP = void 0;
const other_prints_1 = require("../set-ex-power-keepers/other-prints");
const pokeball_1 = require("../set-jungle/pokeball");
const other_prints_2 = require("../set-gym-challenge/other-prints");
const energy_search_1 = require("../set-fossil/energy-search");
const potion_1 = require("../set-base-set/potion");
const switch_1 = require("../set-scarlet-and-violet/switch");
class SwitchDP extends switch_1.Switch {
    constructor() {
        super(...arguments);
        this.set = 'DP';
        this.setNumber = '119';
        this.regulationMark = '';
        this.fullName = 'Switch DP';
        this.text = 'Switch 1 of your Active Pokémon with 1 of your Benched Pokémon.';
    }
}
exports.SwitchDP = SwitchDP;
class EnergySwitchPKDP extends other_prints_1.EnergySwitchPK {
    constructor() {
        super(...arguments);
        this.setNumber = '107';
        this.fullName = 'Energy Switch DP';
        this.set = 'DP';
    }
}
exports.EnergySwitchPKDP = EnergySwitchPKDP;
class PokeBallDP extends pokeball_1.PokeBall {
    constructor() {
        super(...arguments);
        this.setNumber = '110';
        this.fullName = 'Poké Ball DP';
        this.set = 'DP';
    }
}
exports.PokeBallDP = PokeBallDP;
class WarpPointG2DP extends other_prints_2.WarpPointG2 {
    constructor() {
        super(...arguments);
        this.setNumber = '116';
        this.fullName = 'Warp Point DP';
        this.set = 'DP';
    }
}
exports.WarpPointG2DP = WarpPointG2DP;
class EnergySearchDP extends energy_search_1.EnergySearch {
    constructor() {
        super(...arguments);
        this.setNumber = '117';
        this.fullName = 'Energy Search DP';
        this.set = 'DP';
    }
}
exports.EnergySearchDP = EnergySearchDP;
class PotionDP extends potion_1.Potion {
    constructor() {
        super(...arguments);
        this.setNumber = '118';
        this.fullName = 'Potion DP';
        this.set = 'DP';
    }
}
exports.PotionDP = PotionDP;
