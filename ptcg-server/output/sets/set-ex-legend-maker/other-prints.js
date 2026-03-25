"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RainbowEnergyLM = exports.ChinchouLM = void 0;
const chinchou_1 = require("../set-ex-hidden-legends/chinchou");
const other_prints_1 = require("../set-ex-ruby-and-sapphire/other-prints");
class ChinchouLM extends chinchou_1.Chinchou {
    constructor() {
        super(...arguments);
        this.setNumber = '50';
        this.fullName = 'Chinchou LM';
        this.set = 'LM';
    }
}
exports.ChinchouLM = ChinchouLM;
class RainbowEnergyLM extends other_prints_1.RainbowEnergyRS {
    constructor() {
        super(...arguments);
        this.setNumber = '81';
        this.fullName = 'Rainbow Energy LM';
        this.set = 'LM';
    }
}
exports.RainbowEnergyLM = RainbowEnergyLM;
