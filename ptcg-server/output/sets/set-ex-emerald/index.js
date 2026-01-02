"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEXEmerald = void 0;
const basic_energies_1 = require("./basic-energies");
const feebas_1 = require("./feebas");
const lum_berry_1 = require("./lum-berry");
const medicham_ex_1 = require("./medicham-ex");
const meditite_1 = require("./meditite");
const professor_birch_1 = require("./professor-birch");
const scott_1 = require("./scott");
exports.setEXEmerald = [
    new feebas_1.Feebas(),
    new lum_berry_1.LumBerry(),
    new medicham_ex_1.Medichamex(),
    new meditite_1.Meditite(),
    new professor_birch_1.ProfessorBirch(),
    new scott_1.Scott(),
    // Basic energies
    new basic_energies_1.GrassEnergy(),
    new basic_energies_1.FireEnergy(),
    new basic_energies_1.WaterEnergy(),
    new basic_energies_1.LightningEnergy(),
    new basic_energies_1.PsychicEnergy(),
    new basic_energies_1.FightingEnergy(),
];
