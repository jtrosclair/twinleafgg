"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VsSeekerSV = void 0;
const vs_seeker_1 = require("../set-phantom-forces/vs-seeker");
class VsSeekerSV extends vs_seeker_1.VsSeeker {
    constructor() {
        super(...arguments);
        this.fullName = 'VS Seeker SV';
        this.name = 'VS Seeker';
        this.set = 'SV';
        this.setNumber = '140';
        this.text = 'Search your discard pile for a Supporter card, show it to your opponent, and put it into your hand.';
    }
}
exports.VsSeekerSV = VsSeekerSV;
