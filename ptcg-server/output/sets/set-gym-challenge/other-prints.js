"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarpPointG2 = void 0;
const escape_rope_1 = require("../set-battle-styles/escape-rope");
class WarpPointG2 extends escape_rope_1.EscapeRope {
    constructor() {
        super(...arguments);
        this.fullName = 'Warp Point G2';
        this.name = 'Warp Point';
        this.set = 'G2';
        this.setNumber = '126';
        this.text = 'If your opponent has any Benched Pokémon, he or she chooses 1 of them and switches it with his or her Active Pokémon, then, if you have any Benched Pokémon, you switch 1 of them with your Active Pokémon.';
    }
}
exports.WarpPointG2 = WarpPointG2;
