"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurffieldStadiumEVSSR = exports.RayquazaVMAXAA = exports.RayquazaVAA = void 0;
const rayquaza_v_1 = require("./rayquaza-v");
const rayquaza_vmax_1 = require("./rayquaza-vmax");
const turffield_stadium_1 = require("../set-champions-path/turffield-stadium");
class RayquazaVAA extends rayquaza_v_1.RayquazaV {
    constructor() {
        super(...arguments);
        this.setNumber = '194';
        this.fullName = 'RayquazaVAA EVS';
    }
}
exports.RayquazaVAA = RayquazaVAA;
class RayquazaVMAXAA extends rayquaza_vmax_1.RayquazaVMAX {
    constructor() {
        super(...arguments);
        this.setNumber = '218';
        this.fullName = 'RayquazaVMAXAA EVS';
    }
}
exports.RayquazaVMAXAA = RayquazaVMAXAA;
class TurffieldStadiumEVSSR extends turffield_stadium_1.TurffieldStadium {
    constructor() {
        super(...arguments);
        this.set = 'EVS';
        this.setNumber = '234';
        this.fullName = 'Turffield Stadium EVS SR';
    }
}
exports.TurffieldStadiumEVSSR = TurffieldStadiumEVSSR;
