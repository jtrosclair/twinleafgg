"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setArceus = void 0;
const arceus_1 = require("./arceus");
const arceus_dark_1 = require("./arceus-dark");
const arceus_fighting_1 = require("./arceus-fighting");
const arceus_fire_1 = require("./arceus-fire");
const arceus_grass_1 = require("./arceus-grass");
const arceus_lightning_1 = require("./arceus-lightning");
const arceus_lv_x_1_1 = require("./arceus-lv-x-1");
const arceus_lv_x_2_1 = require("./arceus-lv-x-2");
const arceus_lv_x_3_1 = require("./arceus-lv-x-3");
const arceus_metal_1 = require("./arceus-metal");
const arceus_psychic_1 = require("./arceus-psychic");
const arceus_water_1 = require("./arceus-water");
const beginning_door_1 = require("./beginning-door");
const expert_belt_1 = require("./expert-belt");
const gengar_1 = require("./gengar");
const spiritomb_1 = require("./spiritomb");
exports.setArceus = [
    new beginning_door_1.BeginningDoor(),
    new expert_belt_1.ExpertBelt(),
    new arceus_1.Arceus(),
    new arceus_metal_1.ArceusMetal(),
    new arceus_fighting_1.ArceusFighting(),
    new arceus_psychic_1.ArceusPsychic(),
    new arceus_lightning_1.ArceusLightning(),
    new arceus_water_1.ArceusWater(),
    new arceus_fire_1.ArceusFire(),
    new arceus_grass_1.ArceusGrass(),
    new arceus_dark_1.ArceusDark(),
    new arceus_lv_x_1_1.ArceusLvX1(),
    new arceus_lv_x_2_1.ArceusLvX2(),
    new arceus_lv_x_3_1.ArceusLvX3(),
    new gengar_1.Gengar(),
    new spiritomb_1.Spiritomb()
];
