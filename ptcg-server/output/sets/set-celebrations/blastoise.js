"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blastoise = void 0;
const blastoise_1 = require("../set-base-set/blastoise");
class Blastoise extends blastoise_1.Blastoise {
    constructor() {
        super(...arguments);
        this.set = 'CEL';
        this.setNumber = '2A';
        this.fullName = 'Blastoise CEL';
    }
}
exports.Blastoise = Blastoise;
