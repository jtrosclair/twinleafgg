"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Venusaur = void 0;
const venusaur_1 = require("../set-base-set/venusaur");
class Venusaur extends venusaur_1.Venusaur {
    constructor() {
        super(...arguments);
        this.set = 'CEL';
        this.setNumber = '15A';
        this.fullName = 'Venusaur CEL';
    }
}
exports.Venusaur = Venusaur;
