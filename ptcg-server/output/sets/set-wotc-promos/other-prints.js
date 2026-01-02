"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PsyduckPR = exports.MewtwoPR = void 0;
const mewtwo_1 = require("./mewtwo");
const psyduck_1 = require("../set-fossil/psyduck");
class MewtwoPR extends mewtwo_1.Mewtwo {
    constructor() {
        super(...arguments);
        this.set = 'PR';
        this.setNumber = '14';
        this.fullName = 'Mewtwo PR 14';
    }
}
exports.MewtwoPR = MewtwoPR;
class PsyduckPR extends psyduck_1.Psyduck {
    constructor() {
        super(...arguments);
        this.set = 'PR';
        this.setNumber = '20';
        this.fullName = 'Psyduck PR';
    }
}
exports.PsyduckPR = PsyduckPR;
