"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleffaHSP = exports.TyphlosionHSP = exports.MeganiumHSP = void 0;
const meganium_prime_1 = require("../set-heartgold-and-soulsilver/meganium-prime");
const typhlosion_1 = require("../set-heartgold-and-soulsilver/typhlosion");
const cleffa_1 = require("../set-heartgold-and-soulsilver/cleffa");
class MeganiumHSP extends meganium_prime_1.Meganium {
    constructor() {
        super(...arguments);
        this.setNumber = '8';
        this.fullName = 'Meganium HSP';
        this.set = 'HSP';
    }
}
exports.MeganiumHSP = MeganiumHSP;
class TyphlosionHSP extends typhlosion_1.Typhlosion {
    constructor() {
        super(...arguments);
        this.setNumber = '9';
        this.fullName = 'Typhlosion HSP';
        this.set = 'HSP';
    }
}
exports.TyphlosionHSP = TyphlosionHSP;
class CleffaHSP extends cleffa_1.Cleffa {
    constructor() {
        super(...arguments);
        this.setNumber = '12';
        this.fullName = 'Cleffa HSP';
        this.set = 'HSP';
    }
}
exports.CleffaHSP = CleffaHSP;
