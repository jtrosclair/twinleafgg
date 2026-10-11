"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.english30CRgbPrints = exports.EnglishMewB = exports.EnglishMewG = exports.EnglishMewR = void 0;
const mew_1 = require("./mew");
// https://limitlesstcg.com/cards/30C/R, /G, /B: same Psychic text as #65.
class EnglishMewR extends mew_1.Mew {
    constructor() {
        super(...arguments);
        this.setNumber = 'R';
        this.usSetNumber = '30C R';
        this.fullName = 'Mew 30C R';
    }
}
exports.EnglishMewR = EnglishMewR;
class EnglishMewG extends mew_1.Mew {
    constructor() {
        super(...arguments);
        this.setNumber = 'G';
        this.usSetNumber = '30C G';
        this.fullName = 'Mew 30C G';
    }
}
exports.EnglishMewG = EnglishMewG;
class EnglishMewB extends mew_1.Mew {
    constructor() {
        super(...arguments);
        this.setNumber = 'B';
        this.usSetNumber = '30C B';
        this.fullName = 'Mew 30C B';
    }
}
exports.EnglishMewB = EnglishMewB;
exports.english30CRgbPrints = [new EnglishMewR(), new EnglishMewG(), new EnglishMewB()];
