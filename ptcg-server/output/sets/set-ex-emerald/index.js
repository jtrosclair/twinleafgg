"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEXEmerald = void 0;
const basic_energies_1 = require("./basic-energies");
const feebas_1 = require("./feebas");
const loudred_1 = require("./loudred");
const lum_berry_1 = require("./lum-berry");
const medicham_ex_1 = require("./medicham-ex");
const meditite_1 = require("./meditite");
const professor_birch_1 = require("./professor-birch");
const scott_1 = require("./scott");
const treecko_1 = require("./treecko");
const voltorb_1 = require("./voltorb");
// Other prints
const other_prints_1 = require("./other-prints");
exports.setEXEmerald = [
    new feebas_1.Feebas(),
    new loudred_1.Loudred(),
    new lum_berry_1.LumBerry(),
    new medicham_ex_1.Medichamex(),
    new meditite_1.Meditite(),
    new professor_birch_1.ProfessorBirch(),
    new scott_1.Scott(),
    new treecko_1.Treecko(),
    new voltorb_1.Voltorb(),
    // Other prints
    new other_prints_1.DarknessEnergySpecialEM(),
    new other_prints_1.DoubleRainbowEnergyEM(),
    new other_prints_1.MetalEnergySpecialEM(),
    new other_prints_1.MultiEnergyEM(),
    new other_prints_1.RareCandyEM(),
    new other_prints_1.WallysTrainingEM(),
    // Basic energies
    new basic_energies_1.GrassEnergy(),
    new basic_energies_1.FireEnergy(),
    new basic_energies_1.WaterEnergy(),
    new basic_energies_1.LightningEnergy(),
    new basic_energies_1.PsychicEnergy(),
    new basic_energies_1.FightingEnergy(),
];
