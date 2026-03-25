"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchRS = exports.RainbowEnergyRS = exports.PokemonReversalRS = exports.MetalEnergySpecialRS = exports.EnergyRemoval2RS = exports.EnergySwitchRS = exports.EnergySearchRS = void 0;
const energy_search_1 = require("../set-scarlet-and-violet/energy-search");
const energy_switch_1 = require("../set-scarlet-and-violet/energy-switch");
const energy_removal_2_1 = require("../set-ex-power-keepers/energy-removal-2");
const metal_energy_special_1 = require("../set-undaunted/metal-energy-special");
const pokemon_reversal_1 = require("../set-ex-unseen-forces/pokemon-reversal");
const rainbow_energy_1 = require("../set-sun-and-moon/rainbow-energy");
const switch_1 = require("../set-base-set/switch");
class EnergySearchRS extends energy_search_1.EnergySearch {
    constructor() {
        super(...arguments);
        this.set = 'RS';
        this.setNumber = '90';
        this.fullName = 'Energy Search RS';
        this.text = 'Search your deck for a basic Energy card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.';
    }
}
exports.EnergySearchRS = EnergySearchRS;
class EnergySwitchRS extends energy_switch_1.EnergySwitch {
    constructor() {
        super(...arguments);
        this.set = 'RS';
        this.regulationMark = '';
        this.setNumber = '82';
        this.fullName = 'Energy Switch RS';
        this.text = 'Move a basic Energy from 1 of your Pokémon to another of your Pokémon.';
    }
}
exports.EnergySwitchRS = EnergySwitchRS;
class EnergyRemoval2RS extends energy_removal_2_1.EnergyRemoval2 {
    constructor() {
        super(...arguments);
        this.set = 'RS';
        this.setNumber = '80';
        this.fullName = 'Energy Removal 2 RS';
    }
}
exports.EnergyRemoval2RS = EnergyRemoval2RS;
class MetalEnergySpecialRS extends metal_energy_special_1.MetalEnergySpecial {
    constructor() {
        super(...arguments);
        this.set = 'RS';
        this.setNumber = '94';
        this.fullName = 'Metal Energy RS';
        this.text = 'Damage done by attacks to the Pokémon that Metal Energy is attached to is reduced by 10 (after applying Weakness and Resistance). Ignore this effect if the Pokémon that Metal Energy is attached to isn\'t [M]. Metal Energy provides [M] Energy. (Doesn\'t count as a basic Energy card.)';
    }
}
exports.MetalEnergySpecialRS = MetalEnergySpecialRS;
class PokemonReversalRS extends pokemon_reversal_1.PokemonReversal {
    constructor() {
        super(...arguments);
        this.set = 'RS';
        this.setNumber = '87';
        this.fullName = 'Pokemon Reversal RS';
    }
}
exports.PokemonReversalRS = PokemonReversalRS;
class RainbowEnergyRS extends rainbow_energy_1.RainbowEnergy {
    constructor() {
        super(...arguments);
        this.set = 'RS';
        this.setNumber = '95';
        this.fullName = 'Rainbow Energy RS';
        this.text = 'Attach Rainbow Energy to 1 of your Pokémon. While in play, Rainbow Energy provides every type of Energy but provides only 1 Energy at a time. (Doesn\'t count as a basic Energy card when not in play.) When you attach this card from your hand to 1 of your Pokémon, put 1 damage counter on that Pokémon.';
    }
}
exports.RainbowEnergyRS = RainbowEnergyRS;
class SwitchRS extends switch_1.Switch {
    constructor() {
        super(...arguments);
        this.set = 'RS';
        this.setNumber = '92';
        this.fullName = 'Switch RS';
        this.text = 'Switch 1 of your Active Pokémon with 1 of your Benched Pokémon.';
    }
}
exports.SwitchRS = SwitchRS;
