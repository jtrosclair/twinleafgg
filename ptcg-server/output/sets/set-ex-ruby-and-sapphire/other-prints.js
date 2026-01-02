"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RainbowEnergyRS = exports.MetalEnergySpecialRS = exports.EnergySwitchRS = void 0;
const energy_switch_1 = require("../set-scarlet-and-violet/energy-switch");
const metal_energy_special_1 = require("../set-undaunted/metal-energy-special");
const rainbow_energy_1 = require("../set-sun-and-moon/rainbow-energy");
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
