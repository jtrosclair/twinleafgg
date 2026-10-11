"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UltraBall30C = exports.Switch30C = exports.PokePad30C = exports.Eevee118 = void 0;
const eevee_2_1 = require("./eevee-2");
const other_prints_1 = require("../set-mega-evolution/other-prints");
const poke_pad_1 = require("../set-ascended-heroes/poke-pad");
class Eevee118 extends eevee_2_1.Eevee2 {
    constructor() {
        super(...arguments);
        this.setNumber = '118';
        this.fullName = 'Eevee 30C 2';
    }
}
exports.Eevee118 = Eevee118;
class PokePad30C extends poke_pad_1.PokePad {
    constructor() {
        super(...arguments);
        this.setNumber = '126';
        this.fullName = 'Poké Pad 30C';
        this.set = '30C';
    }
}
exports.PokePad30C = PokePad30C;
class Switch30C extends other_prints_1.SwitchMEG {
    constructor() {
        super(...arguments);
        this.setNumber = '127';
        this.fullName = 'Switch 30C';
        this.set = '30C';
    }
}
exports.Switch30C = Switch30C;
class UltraBall30C extends other_prints_1.UltraBallMEG {
    constructor() {
        super(...arguments);
        this.setNumber = '128';
        this.fullName = 'Ultra Ball 30C';
        this.set = '30C';
    }
}
exports.UltraBall30C = UltraBall30C;
