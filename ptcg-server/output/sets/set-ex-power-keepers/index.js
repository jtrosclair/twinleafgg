"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEXPowerKeepers = void 0;
const basic_energies_1 = require("./basic-energies");
const absol_ex_1 = require("./absol-ex");
const battle_frontier_1 = require("./battle-frontier");
const claw_fossil_1 = require("./claw-fossil");
const cyclone_energy_1 = require("./cyclone-energy");
const energy_removal_2_1 = require("./energy-removal-2");
const flareon_star_1 = require("./flareon-star");
const jolteon_star_1 = require("./jolteon-star");
const machoke_1 = require("./machoke");
const machop_1 = require("./machop");
const mysterious_fossil_1 = require("./mysterious-fossil");
const salamence_ex_1 = require("./salamence-ex");
const skitty_1 = require("./skitty");
const stevens_advice_1 = require("./stevens-advice");
// Other prints
const other_prints_1 = require("./other-prints");
exports.setEXPowerKeepers = [
    new absol_ex_1.Absolex(),
    new battle_frontier_1.BattleFrontier(),
    new claw_fossil_1.ClawFossil(),
    new cyclone_energy_1.CycloneEnergy(),
    new energy_removal_2_1.EnergyRemoval2(),
    new flareon_star_1.FlareonStar(),
    new jolteon_star_1.JolteonStar(),
    new machoke_1.Machoke(),
    new machop_1.Machop(),
    new mysterious_fossil_1.MysteriousFossil(),
    new salamence_ex_1.Salamenceex(),
    new skitty_1.Skitty(),
    new stevens_advice_1.StevensAdvice(),
    // Other prints
    new other_prints_1.DelcattyPK(),
    new other_prints_1.EnergySwitchPK(),
    // Basic energies
    new basic_energies_1.GrassEnergy(),
    new basic_energies_1.FireEnergy(),
    new basic_energies_1.WaterEnergy(),
    new basic_energies_1.LightningEnergy(),
    new basic_energies_1.PsychicEnergy(),
    new basic_energies_1.FightingEnergy(),
];
