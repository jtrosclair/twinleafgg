"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokeBallUF = exports.BoostEnergyUF = exports.WarpEnergyUF = void 0;
const boost_energy_1 = require("../set-aquapolis/boost-energy");
const pokeball_1 = require("../set-jungle/pokeball");
const warp_energy_1 = require("../set-shining-legends/warp-energy");
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
