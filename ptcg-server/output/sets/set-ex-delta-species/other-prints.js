"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperScoopUpDS = exports.MetalEnergySpecialDS = exports.GreatBallDS = exports.DualBallDS = exports.DarknessEnergySpecialDS = void 0;
const darkness_energy_special_1 = require("../set-ex-ruby-and-sapphire/darkness-energy-special");
const dual_ball_1 = require("../set-unleashed/dual-ball");
const great_ball_1 = require("../set-ex-firered-leafgreen/great-ball");
const metal_energy_special_1 = require("../set-undaunted/metal-energy-special");
const super_scoop_up_1 = require("../set-diamond-and-pearl/super-scoop-up");
class DarknessEnergySpecialDS extends darkness_energy_special_1.DarknessEnergySpecial {
    constructor() {
        super(...arguments);
        this.fullName = 'Darkness Energy Special DS';
        this.set = 'DS';
        this.setNumber = '103';
    }
}
exports.DarknessEnergySpecialDS = DarknessEnergySpecialDS;
class DualBallDS extends dual_ball_1.DualBall {
    constructor() {
        super(...arguments);
        this.fullName = 'Dual Ball DS';
        this.set = 'DS';
        this.setNumber = '89';
    }
}
exports.DualBallDS = DualBallDS;
class GreatBallDS extends great_ball_1.GreatBall {
    constructor() {
        super(...arguments);
        this.fullName = 'Great Ball DS';
        this.set = 'DS';
        this.setNumber = '90';
    }
}
exports.GreatBallDS = GreatBallDS;
class MetalEnergySpecialDS extends metal_energy_special_1.MetalEnergySpecial {
    constructor() {
        super(...arguments);
        this.fullName = 'Metal Energy Special DS';
        this.set = 'DS';
        this.setNumber = '107';
    }
}
exports.MetalEnergySpecialDS = MetalEnergySpecialDS;
class SuperScoopUpDS extends super_scoop_up_1.SuperScoopUp {
    constructor() {
        super(...arguments);
        this.fullName = 'Super Scoop Up DS';
        this.set = 'DS';
        this.setNumber = '100';
    }
}
exports.SuperScoopUpDS = SuperScoopUpDS;
