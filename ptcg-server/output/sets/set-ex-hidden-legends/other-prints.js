"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeldumHL = exports.StevensAdviceHL = void 0;
const stevens_advice_1 = require("../set-ex-power-keepers/stevens-advice");
const beldum_1 = require("../set-nintendo-promos/beldum");
class StevensAdviceHL extends stevens_advice_1.StevensAdvice {
    constructor() {
        super(...arguments);
        this.setNumber = '92';
        this.fullName = 'Steven\'s Advice HL';
        this.set = 'HL';
    }
}
exports.StevensAdviceHL = StevensAdviceHL;
class BeldumHL extends beldum_1.Beldum {
    constructor() {
        super(...arguments);
        this.setNumber = '29';
        this.fullName = 'Beldum HL';
        this.set = 'HL';
    }
}
exports.BeldumHL = BeldumHL;
