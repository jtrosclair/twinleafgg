"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNeoGenesis = void 0;
const bills_teleporter_1 = require("./bills-teleporter");
const cleffa_1 = require("./cleffa");
const darkness_energy_special_1 = require("./darkness-energy-special");
const double_gust_1 = require("./double-gust");
const hoothoot_1 = require("./hoothoot");
const mary_1 = require("./mary");
const noctowl_1 = require("./noctowl");
const pichu_1 = require("./pichu");
const professor_elm_1 = require("./professor-elm");
const sneasel_1 = require("./sneasel");
const steelix_1 = require("./steelix");
const totodile_1 = require("./totodile");
// Other prints
const other_prints_1 = require("./other-prints");
exports.setNeoGenesis = [
    new bills_teleporter_1.BillsTeleporter(),
    new cleffa_1.Cleffa(),
    new darkness_energy_special_1.DarknessEnergySpecial(),
    new double_gust_1.DoubleGust(),
    new hoothoot_1.Hoothoot(),
    new mary_1.Mary(),
    new noctowl_1.Noctowl(),
    new pichu_1.Pichu(),
    new professor_elm_1.ProfessorElm(),
    new sneasel_1.Sneasel(),
    new steelix_1.Steelix(),
    new totodile_1.Totodile(),
    // Other prints
    new other_prints_1.MetalEnergyN1(),
    new other_prints_1.RecycleEnergyN1(),
    new other_prints_1.SuperEnergyRetrieval(),
];
