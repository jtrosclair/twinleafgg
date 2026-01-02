"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetalEnergyN1SW = exports.DarknessEnergySpecialSW = exports.SwitchSW = exports.PotionSW = exports.PlusPowerSW = exports.BebesSearchSW = exports.NightMaintenanceSW = void 0;
const bebes_search_1 = require("../set-mysterious-treasures/bebes-search");
const pluspower_1 = require("../set-base-set/pluspower");
const potion_1 = require("../set-base-set/potion");
const switch_1 = require("../set-base-set/switch");
const darkness_energy_special_1 = require("../set-neo-genesis/darkness-energy-special");
const other_prints_1 = require("../set-neo-genesis/other-prints");
const super_rod_1 = require("../set-paldea-evolved/super-rod");
class NightMaintenanceSW extends super_rod_1.SuperRod {
    constructor() {
        super(...arguments);
        this.fullName = 'Night Maintenance SW';
        this.name = 'Night Maintenance';
        this.set = 'SW';
        this.setNumber = '120';
        this.text = 'Search your discard pile for up to 3 in any combination of Pokémon and basic Energy cards. Show them to your opponent and shuffle them into your deck.';
    }
}
exports.NightMaintenanceSW = NightMaintenanceSW;
class BebesSearchSW extends bebes_search_1.BebesSearch {
    constructor() {
        super(...arguments);
        this.setNumber = '119';
        this.fullName = 'Bebe\'s Search SW';
        this.set = 'SW';
    }
}
exports.BebesSearchSW = BebesSearchSW;
class PlusPowerSW extends pluspower_1.PlusPower {
    constructor() {
        super(...arguments);
        this.setNumber = '121';
        this.fullName = 'PlusPower SW';
        this.set = 'SW';
    }
}
exports.PlusPowerSW = PlusPowerSW;
class PotionSW extends potion_1.Potion {
    constructor() {
        super(...arguments);
        this.setNumber = '127';
        this.fullName = 'Potion SW';
        this.set = 'SW';
    }
}
exports.PotionSW = PotionSW;
class SwitchSW extends switch_1.Switch {
    constructor() {
        super(...arguments);
        this.setNumber = '128';
        this.fullName = 'Switch SW';
        this.set = 'SW';
    }
}
exports.SwitchSW = SwitchSW;
class DarknessEnergySpecialSW extends darkness_energy_special_1.DarknessEnergySpecial {
    constructor() {
        super(...arguments);
        this.setNumber = '129';
        this.fullName = 'Darkness Energy SW';
        this.set = 'SW';
    }
}
exports.DarknessEnergySpecialSW = DarknessEnergySpecialSW;
class MetalEnergyN1SW extends other_prints_1.MetalEnergyN1 {
    constructor() {
        super(...arguments);
        this.setNumber = '130';
        this.fullName = 'Metal Energy SW';
        this.set = 'SW';
    }
}
exports.MetalEnergyN1SW = MetalEnergyN1SW;
