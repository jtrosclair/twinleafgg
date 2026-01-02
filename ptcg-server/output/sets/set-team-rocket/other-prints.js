"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RainbowEnergyTR = void 0;
const rainbow_energy_1 = require("../set-sun-and-moon/rainbow-energy");
class RainbowEnergyTR extends rainbow_energy_1.RainbowEnergy {
    constructor() {
        super(...arguments);
        this.set = 'TR';
        this.setNumber = '17';
        this.fullName = 'Rainbow Energy TR';
        this.text = 'Attach Rainbow Energy to 1 of your Pokémon. While in play, Rainbow Energy counts as every type of basic Energy but only provides 1 Energy at a time. (Doesn\'t count as a basic Energy card when not in play.) When you attach this card from your hand to 1 of your Pokémon, it does 10 damage to that Pokémon. (Don\'t apply Weakness and Resistance.)';
    }
}
exports.RainbowEnergyTR = RainbowEnergyTR;
