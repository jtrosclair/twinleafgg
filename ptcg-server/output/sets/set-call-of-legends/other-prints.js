"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VulpixCL = exports.SmeargleCL = exports.QuilavaCL = exports.ProfessorElmsTrainingMethodCL = exports.NinetalesCL = exports.DualBallCL = exports.CopycatCL = exports.CleffaCL = void 0;
const cleffa_1 = require("../set-heartgold-and-soulsilver/cleffa");
const copycat_1 = require("../set-evolving-skies/copycat");
const dual_ball_1 = require("../set-unleashed/dual-ball");
const ninetales_1 = require("../set-heartgold-and-soulsilver/ninetales");
const professors_elm_training_method_1 = require("../set-ex-unseen-forces/professors-elm-training-method");
const quilava_1 = require("../set-heartgold-and-soulsilver/quilava");
const smeargle_1 = require("../set-undaunted/smeargle");
const vulpix_1 = require("../set-heartgold-and-soulsilver/vulpix");
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
class DualBallCL extends dual_ball_1.DualBall {
    constructor() {
        super(...arguments);
        this.fullName = 'Dual Ball CL';
        this.set = 'CL';
        this.setNumber = '78';
        this.text = 'Flip 2 coins. For each heads, search your deck for a Basic Pokémon, show it to your opponent, and put it into your hand. If you do, shuffle your deck afterward.';
    }
}
exports.DualBallCL = DualBallCL;
class NinetalesCL extends ninetales_1.Ninetales {
    constructor() {
        super(...arguments);
        this.fullName = 'Ninetales CL';
        this.set = 'CL';
        this.setNumber = '17';
    }
}
exports.NinetalesCL = NinetalesCL;
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
class QuilavaCL extends quilava_1.Quilava {
    constructor() {
        super(...arguments);
        this.fullName = 'Quilava CL';
        this.set = 'CL';
        this.setNumber = '49';
    }
}
exports.QuilavaCL = QuilavaCL;
class SmeargleCL extends smeargle_1.Smeargle {
    constructor() {
        super(...arguments);
        this.fullName = 'Smeargle CL';
        this.set = 'CL';
        this.setNumber = '21';
    }
}
exports.SmeargleCL = SmeargleCL;
class VulpixCL extends vulpix_1.Vulpix {
    constructor() {
        super(...arguments);
        this.fullName = 'Vulpix CL';
        this.set = 'CL';
        this.setNumber = '75';
    }
}
exports.VulpixCL = VulpixCL;
