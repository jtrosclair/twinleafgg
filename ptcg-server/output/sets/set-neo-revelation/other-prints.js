"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalloonBerryN3 = void 0;
const balloon_berry_1 = require("../set-ex-dragon/balloon-berry");
class BalloonBerryN3 extends balloon_berry_1.BalloonBerry {
    constructor() {
        super(...arguments);
        this.fullName = 'Balloon Berry N3';
        this.name = 'Balloon Berry';
        this.set = 'N3';
        this.setNumber = '60';
        this.text = 'When the Pokémon Balloon Berry is attached to retreats, discard Balloon Berry instead of discarding Energy cards.';
    }
}
exports.BalloonBerryN3 = BalloonBerryN3;
