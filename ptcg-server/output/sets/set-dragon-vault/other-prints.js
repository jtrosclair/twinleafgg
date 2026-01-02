"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperRodDRV = exports.ExpShareDRV = void 0;
const exp_share_1 = require("../set-scarlet-and-violet/exp-share");
const super_rod_1 = require("../set-noble-victories/super-rod");
class ExpShareDRV extends exp_share_1.ExpShare {
    constructor() {
        super(...arguments);
        this.setNumber = '18';
        this.fullName = 'Exp. Share DRV';
        this.set = 'DRV';
    }
}
exports.ExpShareDRV = ExpShareDRV;
class SuperRodDRV extends super_rod_1.SuperRod {
    constructor() {
        super(...arguments);
        this.setNumber = '20';
        this.fullName = 'Super Rod DRV';
        this.set = 'DRV';
    }
}
exports.SuperRodDRV = SuperRodDRV;
