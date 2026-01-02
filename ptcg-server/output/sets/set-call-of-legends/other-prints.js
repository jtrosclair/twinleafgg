"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmeargleCL = exports.ProfessorElmsTrainingMethodCL = exports.CopycatCL = exports.CleffaCL = void 0;
const cleffa_1 = require("../set-heartgold-and-soulsilver/cleffa");
const copycat_1 = require("../set-evolving-skies/copycat");
const professors_elm_training_method_1 = require("../set-ex-unseen-forces/professors-elm-training-method");
const smeargle_1 = require("../set-undaunted/smeargle");
class CleffaCL extends cleffa_1.Cleffa {
    constructor() {
        super(...arguments);
        this.fullName = 'Cleffa CL';
        this.set = 'CL';
        this.setNumber = '24';
    }
}
exports.CleffaCL = CleffaCL;
class CopycatCL extends copycat_1.Copycat {
    constructor() {
        super(...arguments);
        this.fullName = 'Copycat CL';
        this.set = 'CL';
        this.setNumber = '77';
        this.text = 'Shuffle your hand into your deck. Then, draw a card for each card in your opponent\'s hand.';
    }
}
exports.CopycatCL = CopycatCL;
class ProfessorElmsTrainingMethodCL extends professors_elm_training_method_1.ProfessorElmsTrainingMethod {
    constructor() {
        super(...arguments);
        this.fullName = 'Professor Elm\'s Training Method CL';
        this.set = 'CL';
        this.setNumber = '82';
        this.text = 'Search your deck for an Evolution card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.';
    }
}
exports.ProfessorElmsTrainingMethodCL = ProfessorElmsTrainingMethodCL;
class SmeargleCL extends smeargle_1.Smeargle {
    constructor() {
        super(...arguments);
        this.fullName = 'Smeargle CL';
        this.set = 'CL';
        this.setNumber = '21';
    }
}
exports.SmeargleCL = SmeargleCL;
