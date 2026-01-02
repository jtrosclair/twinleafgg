"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SagesTrainingUD = exports.DefenderUD = exports.UmbreonUD = void 0;
const umbreon_1 = require("../set-call-of-legends/umbreon");
const defender_1 = require("../set-base-set/defender");
const sages_training_1 = require("../set-call-of-legends/sages-training");
class UmbreonUD extends umbreon_1.Umbreon {
    constructor() {
        super(...arguments);
        this.setNumber = '10';
        this.fullName = 'Umbreon UD';
        this.set = 'UD';
    }
}
exports.UmbreonUD = UmbreonUD;
class DefenderUD extends defender_1.Defender {
    constructor() {
        super(...arguments);
        this.setNumber = '72';
        this.fullName = 'Defender UD';
        this.set = 'UD';
    }
}
exports.DefenderUD = DefenderUD;
class SagesTrainingUD extends sages_training_1.SagesTraining {
    constructor() {
        super(...arguments);
        this.setNumber = '77';
        this.fullName = 'Sage\'s Training UD';
        this.set = 'UD';
    }
}
exports.SagesTrainingUD = SagesTrainingUD;
