"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarpPointUF = exports.WarpEnergyUF = exports.PokeBallUF = exports.MetalEnergySpecialUF = exports.EnergyRemoval2UF = exports.DarknessEnergySpecialUF = exports.CycloneEnergyUF = exports.BoostEnergyUF = void 0;
const boost_energy_1 = require("../set-aquapolis/boost-energy");
const cyclone_energy_1 = require("../set-ex-power-keepers/cyclone-energy");
const darkness_energy_special_1 = require("../set-ex-ruby-and-sapphire/darkness-energy-special");
const energy_removal_2_1 = require("../set-ex-power-keepers/energy-removal-2");
const metal_energy_special_1 = require("../set-undaunted/metal-energy-special");
const pokeball_1 = require("../set-jungle/pokeball");
const warp_energy_1 = require("../set-shining-legends/warp-energy");
const other_prints_1 = require("../set-ex-team-magma-vs-team-aqua/other-prints");
class BoostEnergyUF extends boost_energy_1.BoostEnergy {
    constructor() {
        super(...arguments);
        this.fullName = 'Boost Energy UF';
        this.set = 'UF';
        this.setNumber = '98';
        this.text = 'Boost Energy can be attached only to an Evolved Pokémon. Discard Boost Energy at the end of the turn it was attached. Boost Energy provides [C][C][C] Energy. The Pokémon Boost Energy is attached to can\'t retreat. When the Pokémon Boost Energy is attached to is no longer an Evolved Pokémon, discard Boost Energy.';
    }
}
exports.BoostEnergyUF = BoostEnergyUF;
class CycloneEnergyUF extends cyclone_energy_1.CycloneEnergy {
    constructor() {
        super(...arguments);
        this.fullName = 'Cyclone Energy UF';
        this.set = 'UF';
        this.setNumber = '99';
    }
}
exports.CycloneEnergyUF = CycloneEnergyUF;
class DarknessEnergySpecialUF extends darkness_energy_special_1.DarknessEnergySpecial {
    constructor() {
        super(...arguments);
        this.fullName = 'Darkness Energy Special UF';
        this.set = 'UF';
        this.setNumber = '96';
    }
}
exports.DarknessEnergySpecialUF = DarknessEnergySpecialUF;
class EnergyRemoval2UF extends energy_removal_2_1.EnergyRemoval2 {
    constructor() {
        super(...arguments);
        this.fullName = 'Energy Removal 2 UF';
        this.set = 'UF';
        this.setNumber = '82';
    }
}
exports.EnergyRemoval2UF = EnergyRemoval2UF;
class MetalEnergySpecialUF extends metal_energy_special_1.MetalEnergySpecial {
    constructor() {
        super(...arguments);
        this.fullName = 'Metal Energy Special UF';
        this.set = 'UF';
        this.setNumber = '97';
        this.text = 'Damage done by attacks to the Pokémon that Metal Energy is attached to is reduced by 10 (after applying Weakness and Resistance). Ignore this effect if the Pokémon that Metal Energy is attached to isn\'t [M]. Metal Energy provides [M] Energy. (Doesn\'t count as a basic Energy card.)';
    }
}
exports.MetalEnergySpecialUF = MetalEnergySpecialUF;
class PokeBallUF extends pokeball_1.PokeBall {
    constructor() {
        super(...arguments);
        this.fullName = 'Poké Ball UF';
        this.set = 'UF';
        this.setNumber = '87';
        this.text = 'Flip a coin. If heads, search your deck for a Pokémon, reveal it, and put it into your hand. Shuffle your deck afterward.';
    }
}
exports.PokeBallUF = PokeBallUF;
class WarpEnergyUF extends warp_energy_1.WarpEnergy {
    constructor() {
        super(...arguments);
        this.fullName = 'Warp Energy UF';
        this.set = 'UF';
        this.setNumber = '100';
        this.text = 'Warp Energy provides [C] Energy. When you attach this card from your hand to your Active Pokémon, switch that Pokémon with 1 of your Benched Pokémon.';
    }
}
exports.WarpEnergyUF = WarpEnergyUF;
class WarpPointUF extends other_prints_1.WarpPointMA {
    constructor() {
        super(...arguments);
        this.fullName = 'Warp Point UF';
        this.set = 'UF';
        this.setNumber = '93';
    }
}
exports.WarpPointUF = WarpPointUF;
