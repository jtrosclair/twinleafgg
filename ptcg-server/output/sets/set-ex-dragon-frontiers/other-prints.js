"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TvReporterDF = exports.SwitchDF = exports.ProfessorElmsTrainingMethodDF = exports.BoostEnergyDF = void 0;
const boost_energy_1 = require("../set-aquapolis/boost-energy");
const professors_elm_training_method_1 = require("../set-ex-unseen-forces/professors-elm-training-method");
const other_prints_1 = require("../set-expedition/other-prints");
const tv_reporter_1 = require("../set-ex-dragon/tv-reporter");
class BoostEnergyDF extends boost_energy_1.BoostEnergy {
    constructor() {
        super(...arguments);
        this.fullName = 'Boost Energy DF';
        this.set = 'DF';
        this.setNumber = '87';
        this.text = 'Boost Energy can be attached only to an Evolved Pokémon. Discard Boost Energy at the end of the turn it was attached. Boost Energy provides [C][C][C] Energy. The Pokémon Boost Energy is attached to can\'t retreat. When the Pokémon Boost Energy is attached to is no longer an Evolved Pokémon, discard Boost Energy.';
    }
}
exports.BoostEnergyDF = BoostEnergyDF;
class ProfessorElmsTrainingMethodDF extends professors_elm_training_method_1.ProfessorElmsTrainingMethod {
    constructor() {
        super(...arguments);
        this.fullName = 'Professor Elm\'s Training Method DF';
        this.set = 'DF';
        this.setNumber = '79';
    }
}
exports.ProfessorElmsTrainingMethodDF = ProfessorElmsTrainingMethodDF;
class SwitchDF extends other_prints_1.SwitchEX {
    constructor() {
        super(...arguments);
        this.fullName = 'Switch DF';
        this.set = 'DF';
        this.setNumber = '83';
    }
}
exports.SwitchDF = SwitchDF;
class TvReporterDF extends tv_reporter_1.TvReporter {
    constructor() {
        super(...arguments);
        this.fullName = 'TV Reporter DF';
        this.set = 'DF';
        this.setNumber = '82';
    }
}
exports.TvReporterDF = TvReporterDF;
