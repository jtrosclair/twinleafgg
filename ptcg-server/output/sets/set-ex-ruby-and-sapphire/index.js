"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEXRubyAndSapphire = void 0;
const basic_energies_1 = require("./basic-energies");
const combusken_1 = require("./combusken");
const darkness_energy_special_1 = require("./darkness-energy-special");
const delcatty_1 = require("./delcatty");
const gardevoir_1 = require("./gardevoir");
const kirlia_1 = require("./kirlia");
const marshtomp_1 = require("./marshtomp");
const mudkip_1 = require("./mudkip");
const oran_berry_1 = require("./oran-berry");
const pokenav_1 = require("./pokenav");
const ralts_1 = require("./ralts");
const sceptile_1 = require("./sceptile");
const skitty_1 = require("./skitty");
const skitty2_1 = require("./skitty2");
const swampert_1 = require("./swampert");
const torchic_1 = require("./torchic");
const blaziken_1 = require("./blaziken");
// Other Prints
const other_prints_1 = require("./other-prints");
exports.setEXRubyAndSapphire = [
    new combusken_1.Combusken(),
    new darkness_energy_special_1.DarknessEnergySpecial(),
    new delcatty_1.Delcatty(),
    new gardevoir_1.Gardevoir(),
    new kirlia_1.Kirlia(),
    new marshtomp_1.Marshtomp(),
    new mudkip_1.Mudkip(),
    new oran_berry_1.OranBerry(),
    new pokenav_1.PokeNav(),
    new ralts_1.Ralts(),
    new sceptile_1.Sceptile(),
    new skitty_1.Skitty(),
    new skitty2_1.Skitty2(),
    new swampert_1.Swampert(),
    new torchic_1.Torchic(),
    new blaziken_1.Blaziken(),
    // Basic energies
    new basic_energies_1.GrassEnergy(),
    new basic_energies_1.FireEnergy(),
    new basic_energies_1.WaterEnergy(),
    new basic_energies_1.LightningEnergy(),
    new basic_energies_1.PsychicEnergy(),
    new basic_energies_1.FightingEnergy(),
    // Other Prints
    new other_prints_1.EnergySwitchRS(),
    new other_prints_1.MetalEnergySpecialRS(),
    new other_prints_1.RainbowEnergyRS(),
];
