"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.english30CExPrints = exports.EnglishMewEx66 = exports.EnglishMewtwoEx64 = void 0;
const mewtwo_ex_1 = require("./mewtwo-ex");
const mew_ex_1 = require("./mew-ex");
// https://api.tcgdex.net/v2/en/cards/30th-064 and /30th-066.
// Identical printed text to the existing M6a implementations; additive identities.
class EnglishMewtwoEx64 extends mewtwo_ex_1.Mewtwoex {
    constructor() {
        super(...arguments);
        this.set = '30C';
        this.setNumber = '64';
        this.usSetNumber = '30C 64';
        this.fullName = 'Mewtwo ex 30C 64';
    }
}
exports.EnglishMewtwoEx64 = EnglishMewtwoEx64;
class EnglishMewEx66 extends mew_ex_1.Mewex {
    constructor() {
        super(...arguments);
        this.set = '30C';
        this.setNumber = '66';
        this.usSetNumber = '30C 66';
        this.fullName = 'Mew ex 30C 66';
    }
}
exports.EnglishMewEx66 = EnglishMewEx66;
exports.english30CExPrints = [new EnglishMewtwoEx64(), new EnglishMewEx66()];
