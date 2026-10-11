"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnglishMewtwo63 = void 0;
const mewtwo_1 = require("./mewtwo");
// https://api.tcgdex.net/v2/en/cards/30th-063 — same printed attacks.
// Preserve Mewtwo 30C's legacy #64 identity for existing puzzles.
class EnglishMewtwo63 extends mewtwo_1.Mewtwo {
    constructor() {
        super(...arguments);
        this.setNumber = '63';
        this.usSetNumber = '30C 63';
        this.fullName = 'Mewtwo 30C 63';
    }
}
exports.EnglishMewtwo63 = EnglishMewtwo63;
