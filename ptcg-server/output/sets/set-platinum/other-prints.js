"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScytherPL = exports.HitmonchanPL = exports.ElectabuzzPL = exports.PokedexHandyPL = exports.PokeBallPL = exports.PlusPowerPL = exports.RainbowEnergyPL = void 0;
const pluspower_1 = require("../set-base-set/pluspower");
const pokeball_1 = require("../set-jungle/pokeball");
const pokedex_handy_1 = require("../set-diamond-and-pearl/pokedex-handy");
const electabuzz_1 = require("../set-base-set/electabuzz");
const hitmonchan_1 = require("../set-base-set/hitmonchan");
const scyther_1 = require("../set-jungle/scyther");
const rainbow_energy_1 = require("../set-sun-and-moon/rainbow-energy");
class RainbowEnergyPL extends rainbow_energy_1.RainbowEnergy {
    constructor() {
        super(...arguments);
        this.fullName = 'Rainbow Energy PL';
        this.name = 'Rainbow Energy';
        this.set = 'PL';
        this.setNumber = '121';
        this.text = 'Attach Rainbow Energy to 1 of your Pokémon. While in play, Rainbow Energy provides every type of Energy but provides only 1 Energy at a time. (Has no effect other than providing Energy.) When you attach this card from your hand to 1 of your Pokémon, put 1 damage counter on that Pokémon.';
    }
}
exports.RainbowEnergyPL = RainbowEnergyPL;
class PlusPowerPL extends pluspower_1.PlusPower {
    constructor() {
        super(...arguments);
        this.setNumber = '112';
        this.fullName = 'PlusPower PL';
        this.set = 'PL';
    }
}
exports.PlusPowerPL = PlusPowerPL;
class PokeBallPL extends pokeball_1.PokeBall {
    constructor() {
        super(...arguments);
        this.setNumber = '113';
        this.fullName = 'Poké Ball PL';
        this.set = 'PL';
    }
}
exports.PokeBallPL = PokeBallPL;
class PokedexHandyPL extends pokedex_handy_1.PokedexHandy {
    constructor() {
        super(...arguments);
        this.setNumber = '114';
        this.fullName = 'Pokedex HANDY910is PL';
        this.set = 'PL';
    }
}
exports.PokedexHandyPL = PokedexHandyPL;
class ElectabuzzPL extends electabuzz_1.Electabuzz {
    constructor() {
        super(...arguments);
        this.setNumber = '128';
        this.fullName = 'Electabuzz PL';
        this.set = 'PL';
    }
}
exports.ElectabuzzPL = ElectabuzzPL;
class HitmonchanPL extends hitmonchan_1.Hitmonchan {
    constructor() {
        super(...arguments);
        this.setNumber = '129';
        this.fullName = 'Hitmonchan PL';
        this.set = 'PL';
    }
}
exports.HitmonchanPL = HitmonchanPL;
class ScytherPL extends scyther_1.Scyther {
    constructor() {
        super(...arguments);
        this.setNumber = '130';
        this.fullName = 'Scyther PL';
        this.set = 'PL';
    }
}
exports.ScytherPL = ScytherPL;
