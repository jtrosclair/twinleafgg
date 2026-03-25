"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setGymHeros = void 0;
const basic_energies_1 = require("./basic-energies");
const blaines_last_resort_1 = require("./blaines-last-resort");
const blaines_ponyta_1 = require("./blaines-ponyta");
const brocks_mankey_1 = require("./brocks-mankey");
const brocks_training_method_1 = require("./brocks-training-method");
const brocks_zubat_1 = require("./brocks-zubat");
const brocks_zubat_2_1 = require("./brocks-zubat-2");
const erikas_dratini_1 = require("./erikas-dratini");
const erikas_maids_1 = require("./erikas-maids");
const erikas_perfume_1 = require("./erikas-perfume");
const erikas_weepinbell_1 = require("./erikas-weepinbell");
const erikas_victreebel_1 = require("./erikas-victreebel");
const good_manners_1 = require("./good-manners");
const mistys_poliwhirl_1 = require("./mistys-poliwhirl");
const mistys_wrath_1 = require("./mistys-wrath");
const the_rockets_training_gym_1 = require("./the-rockets-training-gym");
const trash_exchange_1 = require("./trash-exchange");
exports.setGymHeros = [
    new blaines_last_resort_1.BlainesLastResort(),
    new blaines_ponyta_1.BlainesPonyta(),
    new brocks_mankey_1.BrocksMankey(),
    new brocks_training_method_1.BrocksTrainingMethod(),
    new brocks_zubat_1.BrocksZubat(),
    new brocks_zubat_2_1.BrocksZubat2(),
    new erikas_dratini_1.ErikasDratini(),
    new erikas_maids_1.ErikasMaids(),
    new erikas_perfume_1.ErikasPerfume(),
    new erikas_victreebel_1.ErikasVictreebel(),
    new erikas_weepinbell_1.ErikasWeepinbell(),
    new good_manners_1.GoodManners(),
    new mistys_poliwhirl_1.MistysPoliwhirl(),
    new mistys_wrath_1.MistysWrath(),
    new the_rockets_training_gym_1.TheRocketsTrainingGym(),
    new trash_exchange_1.TrashExchange(),
    // Basic energies
    new basic_energies_1.GrassEnergy(),
    new basic_energies_1.FireEnergy(),
    new basic_energies_1.WaterEnergy(),
    new basic_energies_1.LightningEnergy(),
    new basic_energies_1.PsychicEnergy(),
    new basic_energies_1.FightingEnergy(),
];
