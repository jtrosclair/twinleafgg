"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RocketsZapdos = void 0;
const rockets_zapdos_1 = require("../set-gym-challenge/rockets-zapdos");
class RocketsZapdos extends rockets_zapdos_1.RocketsZapdos {
    constructor() {
        super(...arguments);
        this.set = 'CEL';
        this.setNumber = '15A3';
        this.fullName = 'Rocket\'s Zapdos CEL';
    }
}
exports.RocketsZapdos = RocketsZapdos;
