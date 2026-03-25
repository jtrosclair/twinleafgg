"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eelektrik = void 0;
const eelektrik_1 = require("../set-lost-origin/eelektrik");
class Eelektrik extends eelektrik_1.Eelektrik {
    constructor() {
        super(...arguments);
        this.set = 'CRZ';
        this.setNumber = '48';
        this.fullName = 'Eelektrik CRZ 48';
    }
}
exports.Eelektrik = Eelektrik;
