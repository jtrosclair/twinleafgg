"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetalEnergyN1MT = exports.DarknessEnergySpecialMT = exports.QuickBallMT = exports.DuskBallMT = exports.NightMaintenanceMT = exports.MultiEnergyMT = void 0;
const dusk_ball_1 = require("../set-surging-sparks/dusk-ball");
const quick_ball_1 = require("../set-majestic-dawn/quick-ball");
const darkness_energy_special_1 = require("../set-neo-genesis/darkness-energy-special");
const other_prints_1 = require("../set-neo-genesis/other-prints");
const multi_energy_1 = require("../set-ex-sandstorm/multi-energy");
const super_rod_1 = require("../set-noble-victories/super-rod");
class MultiEnergyMT extends multi_energy_1.MultiEnergy {
    constructor() {
        super(...arguments);
        this.fullName = 'Multi Energy MT';
        this.name = 'Multi Energy';
        this.set = 'MT';
        this.setNumber = '118';
        this.text = 'ThAttach Multi Energy to 1 of your Pokémon. While in play, Multi Energy provides every type of Energy but provides only 1 Energy at a time. (Doesn\'t count as a basic Energy card when not in play.) Multi energy provides [C] Energy when attached to a Pokémon that already has Special Energy cards attached to it.';
    }
}
exports.MultiEnergyMT = MultiEnergyMT;
class NightMaintenanceMT extends super_rod_1.SuperRod {
    constructor() {
        super(...arguments);
        this.fullName = 'Night Maintenance MT';
        this.name = 'Night Maintenance';
        this.set = 'MT';
        this.setNumber = '113';
        this.text = 'Search your discard pile for up to 3 in any combination of Pokémon and basic Energy cards. Show them to your opponent and shuffle them into your deck.';
    }
}
exports.NightMaintenanceMT = NightMaintenanceMT;
class DuskBallMT extends dusk_ball_1.DuskBall {
    constructor() {
        super(...arguments);
        this.setNumber = '110';
        this.fullName = 'Dusk Ball MT';
        this.set = 'MT';
    }
}
exports.DuskBallMT = DuskBallMT;
class QuickBallMT extends quick_ball_1.QuickBall {
    constructor() {
        super(...arguments);
        this.setNumber = '114';
        this.fullName = 'Quick Ball MT';
        this.set = 'MT';
    }
}
exports.QuickBallMT = QuickBallMT;
class DarknessEnergySpecialMT extends darkness_energy_special_1.DarknessEnergySpecial {
    constructor() {
        super(...arguments);
        this.setNumber = '119';
        this.fullName = 'Darkness Energy MT';
        this.set = 'MT';
    }
}
exports.DarknessEnergySpecialMT = DarknessEnergySpecialMT;
class MetalEnergyN1MT extends other_prints_1.MetalEnergyN1 {
    constructor() {
        super(...arguments);
        this.setNumber = '120';
        this.fullName = 'Metal Energy MT';
        this.set = 'MT';
    }
}
exports.MetalEnergyN1MT = MetalEnergyN1MT;
