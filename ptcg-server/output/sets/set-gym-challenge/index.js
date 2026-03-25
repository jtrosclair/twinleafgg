"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setGymChallenge = void 0;
const blaine_rapidash_1 = require("./blaine-rapidash");
const chaos_gym_1 = require("./chaos-gym");
const erikas_bellsprout_1 = require("./erikas-bellsprout");
const erikas_clefairy_1 = require("./erikas-clefairy");
const mistys_poliwag_1 = require("./mistys-poliwag");
const resistance_gym_1 = require("./resistance-gym");
const rockets_zapdos_1 = require("./rockets-zapdos");
const transparent_walls_1 = require("./transparent-walls");
// Other prints
const other_prints_1 = require("./other-prints");
exports.setGymChallenge = [
    new blaine_rapidash_1.BlainesRapidash(),
    new chaos_gym_1.ChaosGym(),
    new erikas_bellsprout_1.ErikasBellsprout(),
    new erikas_clefairy_1.ErikasClefairy(),
    new mistys_poliwag_1.MistysPoliwag(),
    new resistance_gym_1.ResistanceGym(),
    new rockets_zapdos_1.RocketsZapdos(),
    new transparent_walls_1.TransparentWalls(),
    // Other prints
    new other_prints_1.WarpPointG2(),
];
