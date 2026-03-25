"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCallOfLegends = void 0;
const cheerleaders_cheer_1 = require("./cheerleaders-cheer");
const jirachi_1 = require("./jirachi");
const lost_remover_1 = require("./lost-remover");
const lost_world_1 = require("./lost-world");
const lucario_1 = require("./lucario");
const mime_jr_1 = require("./mime-jr");
const mr_mime_1 = require("./mr-mime");
const pachirisu_1 = require("./pachirisu");
const relicanth_1 = require("./relicanth");
const sages_training_1 = require("./sages-training");
const tyrogue_1 = require("./tyrogue");
const umbreon_1 = require("./umbreon");
// Other prints
const other_prints_1 = require("./other-prints");
// Basic energies
const basic_energies_1 = require("./basic-energies");
exports.setCallOfLegends = [
    new cheerleaders_cheer_1.CheerleadersCheer(),
    new jirachi_1.Jirachi(),
    new lost_remover_1.LostRemover(),
    new lost_world_1.LostWorld(),
    new lucario_1.Lucario(),
    new mime_jr_1.MimeJr(),
    new mr_mime_1.MrMime(),
    new pachirisu_1.Pachirisu(),
    new relicanth_1.Relicanth(),
    new sages_training_1.SagesTraining(),
    new tyrogue_1.Tyrogue(),
    new umbreon_1.Umbreon(),
    // Other prints
    new other_prints_1.CleffaCL(),
    new other_prints_1.CopycatCL(),
    new other_prints_1.DualBallCL(),
    new other_prints_1.NinetalesCL(),
    new other_prints_1.ProfessorElmsTrainingMethodCL(),
    new other_prints_1.QuilavaCL(),
    new other_prints_1.SmeargleCL(),
    new other_prints_1.VulpixCL(),
    // Basic energies
    new basic_energies_1.GrassEnergy(),
    new basic_energies_1.FireEnergy(),
    new basic_energies_1.WaterEnergy(),
    new basic_energies_1.LightningEnergy(),
    new basic_energies_1.PsychicEnergy(),
    new basic_energies_1.FightingEnergy(),
    new basic_energies_1.DarknessEnergy(),
    new basic_energies_1.MetalEnergy(),
];
