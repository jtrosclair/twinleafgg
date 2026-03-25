"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarpEnergyPK = exports.MetalEnergySpecialPK = exports.MagnetonPK = exports.GreatBallPK = exports.EnergySwitchPK = exports.DelcattyPK = exports.DarknessEnergySpecialPK = void 0;
const darkness_energy_special_1 = require("../set-ex-ruby-and-sapphire/darkness-energy-special");
const delcatty_1 = require("../set-ex-ruby-and-sapphire/delcatty");
const energy_switch_1 = require("../set-scarlet-and-violet/energy-switch");
const great_ball_1 = require("../set-ex-firered-leafgreen/great-ball");
const magneton_1 = require("../set-ex-dragon/magneton");
const metal_energy_special_1 = require("../set-undaunted/metal-energy-special");
const warp_energy_1 = require("../set-shining-legends/warp-energy");
class DarknessEnergySpecialPK extends darkness_energy_special_1.DarknessEnergySpecial {
    constructor() {
        super(...arguments);
        this.fullName = 'Darkness Energy Special PK';
        this.set = 'PK';
        this.setNumber = '87';
    }
}
exports.DarknessEnergySpecialPK = DarknessEnergySpecialPK;
class DelcattyPK extends delcatty_1.Delcatty {
    constructor() {
        super(...arguments);
        this.fullName = 'Delcatty PK';
        this.name = 'Delcatty';
        this.set = 'PK';
        this.setNumber = '8';
    }
}
exports.DelcattyPK = DelcattyPK;
class EnergySwitchPK extends energy_switch_1.EnergySwitch {
    constructor() {
        super(...arguments);
        this.fullName = 'Energy Switch PK';
        this.name = 'Energy Switch';
        this.set = 'PK';
        this.setNumber = '75';
        this.text = 'Move a basic Energy from 1 of your Pokémon to another of your Pokémon.';
    }
}
exports.EnergySwitchPK = EnergySwitchPK;
class GreatBallPK extends great_ball_1.GreatBall {
    constructor() {
        super(...arguments);
        this.fullName = 'Great Ball PK';
        this.set = 'PK';
        this.setNumber = '77';
    }
}
exports.GreatBallPK = GreatBallPK;
class MagnetonPK extends magneton_1.Magneton {
    constructor() {
        super(...arguments);
        this.fullName = 'Magneton PK';
        this.set = 'PK';
        this.setNumber = '16';
    }
}
exports.MagnetonPK = MagnetonPK;
class MetalEnergySpecialPK extends metal_energy_special_1.MetalEnergySpecial {
    constructor() {
        super(...arguments);
        this.fullName = 'Metal Energy Special PK';
        this.set = 'PK';
        this.setNumber = '88';
        this.text = 'Damage done by attacks to the Pokémon that Metal Energy is attached to is reduced by 10 (after applying Weakness and Resistance). Ignore this effect if the Pokémon that Metal Energy is attached to isn\t[M]. Metal Energy provides[M] Energy. (Doesn\t count as a basic Energy card.)';
    }
}
exports.MetalEnergySpecialPK = MetalEnergySpecialPK;
class WarpEnergyPK extends warp_energy_1.WarpEnergy {
    constructor() {
        super(...arguments);
        this.fullName = 'Warp Energy PK';
        this.set = 'PK';
        this.setNumber = '91';
        this.text = 'This card provides [C] Energy.\n\nWhen you attach this card from your hand to your Active Pokémon, switch that Pokémon with 1 of your Benched Pokémon.';
    }
}
exports.WarpEnergyPK = WarpEnergyPK;
