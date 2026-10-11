"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetalEnergyArt = exports.DarknessEnergyArt = exports.FightingEnergyArt = exports.PsychicEnergyArt = exports.LightningEnergyArt = exports.WaterEnergyArt = exports.FireEnergyArt = exports.GrassEnergyArt = void 0;
const basic_energies_1 = require("../set-diamond-and-pearl/basic-energies");
const basic_energies_2 = require("../set-gym-heros/basic-energies");
class GrassEnergyArt extends basic_energies_2.GrassEnergy {
    constructor() {
        super(...arguments);
        this.set = 'M6a';
        this.setNumber = 'GRA';
        this.fullName = 'Grass Energy M6a';
        this.usSetNumber = 'MEE 9';
    }
}
exports.GrassEnergyArt = GrassEnergyArt;
class FireEnergyArt extends basic_energies_2.FireEnergy {
    constructor() {
        super(...arguments);
        this.set = 'M6a';
        this.setNumber = 'FIR';
        this.fullName = 'Fire Energy M6a';
        this.usSetNumber = 'MEE 10';
    }
}
exports.FireEnergyArt = FireEnergyArt;
class WaterEnergyArt extends basic_energies_2.WaterEnergy {
    constructor() {
        super(...arguments);
        this.set = 'M6a';
        this.setNumber = 'WAT';
        this.fullName = 'Water Energy M6a';
        this.usSetNumber = 'MEE 11';
    }
}
exports.WaterEnergyArt = WaterEnergyArt;
class LightningEnergyArt extends basic_energies_2.LightningEnergy {
    constructor() {
        super(...arguments);
        this.set = 'M6a';
        this.setNumber = 'LIG';
        this.fullName = 'Lightning Energy M6a';
        this.usSetNumber = 'MEE 12';
    }
}
exports.LightningEnergyArt = LightningEnergyArt;
class PsychicEnergyArt extends basic_energies_2.PsychicEnergy {
    constructor() {
        super(...arguments);
        this.set = 'M6a';
        this.setNumber = 'PSY';
        this.fullName = 'Psychic Energy M6a';
        this.usSetNumber = 'MEE 13';
    }
}
exports.PsychicEnergyArt = PsychicEnergyArt;
class FightingEnergyArt extends basic_energies_2.FightingEnergy {
    constructor() {
        super(...arguments);
        this.set = 'M6a';
        this.setNumber = 'FIG';
        this.fullName = 'Fighting Energy M6a';
        this.usSetNumber = 'MEE 14';
    }
}
exports.FightingEnergyArt = FightingEnergyArt;
class DarknessEnergyArt extends basic_energies_1.DarknessEnergy {
    constructor() {
        super(...arguments);
        this.set = 'M6a';
        this.setNumber = 'DAR';
        this.fullName = 'Darkness Energy M6a';
        this.usSetNumber = 'MEE 15';
    }
}
exports.DarknessEnergyArt = DarknessEnergyArt;
class MetalEnergyArt extends basic_energies_1.MetalEnergy {
    constructor() {
        super(...arguments);
        this.set = 'M6a';
        this.setNumber = 'MET';
        this.fullName = 'Metal Energy M6a';
        this.usSetNumber = 'MEE 16';
    }
}
exports.MetalEnergyArt = MetalEnergyArt;
