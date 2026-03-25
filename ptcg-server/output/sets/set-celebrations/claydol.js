"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Claydol = void 0;
const claydol_1 = require("../set-great-encounters/claydol");
class Claydol extends claydol_1.Claydol {
    constructor() {
        super(...arguments);
        this.set = 'CEL';
        this.setNumber = '15A4';
        this.fullName = 'Claydol CEL';
    }
}
exports.Claydol = Claydol;
