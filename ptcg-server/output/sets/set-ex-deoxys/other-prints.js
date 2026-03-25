"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LadyOutingDX = exports.BalloonBerryDX = void 0;
const balloon_berry_1 = require("../set-ex-dragon/balloon-berry");
const lady_outing_1 = require("../set-ex-ruby-and-sapphire/lady-outing");
class BalloonBerryDX extends balloon_berry_1.BalloonBerry {
    constructor() {
        super(...arguments);
        this.setNumber = '84';
        this.fullName = 'Balloon Berry DX';
        this.set = 'DX';
    }
}
exports.BalloonBerryDX = BalloonBerryDX;
class LadyOutingDX extends lady_outing_1.LadyOuting {
    constructor() {
        super(...arguments);
        this.setNumber = '87';
        this.fullName = 'Lady Outing DX';
        this.set = 'DX';
    }
}
exports.LadyOutingDX = LadyOutingDX;
