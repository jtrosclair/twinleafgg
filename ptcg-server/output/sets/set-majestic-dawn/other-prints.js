"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetalEnergyN1MD = exports.DarknessEnergySpecialMD = exports.EnergySearchMD = exports.SuperScoopUpMD = exports.PokeBallMD = exports.DuskBallMD = exports.WarpPointMD = void 0;
const dusk_ball_1 = require("../set-surging-sparks/dusk-ball");
const pokeball_1 = require("../set-jungle/pokeball");
const super_scoop_up_1 = require("../set-diamond-and-pearl/super-scoop-up");
const energy_search_1 = require("../set-fossil/energy-search");
const darkness_energy_special_1 = require("../set-neo-genesis/darkness-energy-special");
const other_prints_1 = require("../set-neo-genesis/other-prints");
const escape_rope_1 = require("../set-plasma-storm/escape-rope");
class WarpPointMD extends escape_rope_1.EscapeRope {
    constructor() {
        super(...arguments);
        this.fullName = 'Warp Point MD';
        this.name = 'Warp Point';
        this.set = 'MD';
        this.setNumber = '88';
        this.text = 'If your opponent has any Benched Pokémon, he or she chooses 1 of them and switches it with his or her Active Pokémon, then, if you have any Benched Pokémon, you switch 1 of them with your Active Pokémon.';
    }
}
exports.WarpPointMD = WarpPointMD;
class DuskBallMD extends dusk_ball_1.DuskBall {
    constructor() {
        super(...arguments);
        this.setNumber = '80';
        this.fullName = 'Dusk Ball MD';
        this.set = 'MD';
    }
}
exports.DuskBallMD = DuskBallMD;
class PokeBallMD extends pokeball_1.PokeBall {
    constructor() {
        super(...arguments);
        this.setNumber = '85';
        this.fullName = 'Poké Ball MD';
        this.set = 'MD';
    }
}
exports.PokeBallMD = PokeBallMD;
class SuperScoopUpMD extends super_scoop_up_1.SuperScoopUp {
    constructor() {
        super(...arguments);
        this.setNumber = '87';
        this.fullName = 'Super Scoop Up MD';
        this.set = 'MD';
    }
}
exports.SuperScoopUpMD = SuperScoopUpMD;
class EnergySearchMD extends energy_search_1.EnergySearch {
    constructor() {
        super(...arguments);
        this.setNumber = '90';
        this.fullName = 'Energy Search MD';
        this.set = 'MD';
    }
}
exports.EnergySearchMD = EnergySearchMD;
class DarknessEnergySpecialMD extends darkness_energy_special_1.DarknessEnergySpecial {
    constructor() {
        super(...arguments);
        this.setNumber = '93';
        this.fullName = 'Darkness Energy MD';
        this.set = 'MD';
    }
}
exports.DarknessEnergySpecialMD = DarknessEnergySpecialMD;
class MetalEnergyN1MD extends other_prints_1.MetalEnergyN1 {
    constructor() {
        super(...arguments);
        this.setNumber = '95';
        this.fullName = 'Metal Energy MD';
        this.set = 'MD';
    }
}
exports.MetalEnergyN1MD = MetalEnergyN1MD;
