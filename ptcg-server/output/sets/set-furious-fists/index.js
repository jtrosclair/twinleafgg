"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFuriousFists = void 0;
const other_prints_1 = require("./other-prints");
const dedenne_1 = require("./dedenne");
const fighting_stadium_1 = require("./fighting-stadium");
const focus_sash_1 = require("./focus-sash");
const hawlucha_1 = require("./hawlucha");
const herbal_energy_1 = require("./herbal-energy");
const korrina_1 = require("./korrina");
const lucario_ex_1 = require("./lucario-ex");
const seismitoad_ex_1 = require("./seismitoad-ex");
const strong_energy_1 = require("./strong-energy");
const training_center_1 = require("./training-center");
// Other Prints
const other_prints_2 = require("./other-prints");
exports.setFuriousFists = [
    new dedenne_1.Dedenne(),
    new fighting_stadium_1.FightingStadium(),
    new focus_sash_1.FocusSash(),
    new hawlucha_1.Hawlucha(),
    new herbal_energy_1.HerbalEnergy(),
    new korrina_1.Korrina(),
    new lucario_ex_1.LucarioEx(),
    new seismitoad_ex_1.SeismitoadEx(),
    new strong_energy_1.StrongEnergy(),
    new training_center_1.TrainingCenter(),
    // Other Prints
    new other_prints_2.KorrinaFFI(),
    new other_prints_2.MaintenanceFFI(),
    new other_prints_2.SuperScoopUpFFI(),
    new other_prints_1.EnergySwitchPKFFI(),
    new other_prints_1.FullHealFFI(),
    new other_prints_1.SeismitoadEx2FFI(),
    new other_prints_1.LucarioEx2FFI(),
];
