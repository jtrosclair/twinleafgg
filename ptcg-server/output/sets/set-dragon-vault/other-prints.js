"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShelgonDRV = exports.SuperRodDRV = exports.ExpShareDRV = void 0;
const exp_share_1 = require("../set-scarlet-and-violet/exp-share");
const super_rod_1 = require("../set-noble-victories/super-rod");
const shelgon_1 = require("../set-plasma-blast/shelgon");
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
class ShelgonDRV extends shelgon_1.Shelgon {
    constructor() {
        super(...arguments);
        this.set = 'DRV';
        this.setNumber = '7';
        this.fullName = 'Shelgon DRV';
    }
}
exports.ShelgonDRV = ShelgonDRV;
