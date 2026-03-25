"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GardevoirEx = void 0;
const gardevoir_ex_1 = require("../set-ex-dragon-frontiers/gardevoir-ex");
class GardevoirEx extends gardevoir_ex_1.Gardevoirex {
    constructor() {
        super(...arguments);
        this.set = 'CEL';
        this.setNumber = '93A';
        this.fullName = 'Gardevoir ex CEL';
    }
}
exports.GardevoirEx = GardevoirEx;
