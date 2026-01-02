"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tornadus2EPO = exports.GreatBallEPO = exports.GothitelleEPO = exports.GothoritaEPO = exports.RecycleEPO = exports.CrushingHammerEPO = void 0;
const gothorita_1 = require("../set-legendary-treasures/gothorita");
const gothitelle_1 = require("../set-legendary-treasures/gothitelle");
const great_ball_1 = require("../set-ex-firered-leafgreen/great-ball");
const tornadus_1 = require("../set-emerging-powers/tornadus");
const recycle_1 = require("../set-fossil/recycle");
const crushing_hammer_1 = require("../set-scarlet-and-violet/crushing-hammer");
class CrushingHammerEPO extends crushing_hammer_1.CrushingHammer {
    constructor() {
        super(...arguments);
        this.set = 'EPO';
        this.setNumber = '92';
        this.fullName = 'Crushing Hammer EPO';
    }
}
exports.CrushingHammerEPO = CrushingHammerEPO;
class RecycleEPO extends recycle_1.Recycle {
    constructor() {
        super(...arguments);
        this.set = 'EPO';
        this.setNumber = '96';
        this.fullName = 'Recycle EPO';
        this.text = 'Flip a coin. If heads, put a card from your discard pile on top of your deck.';
    }
}
exports.RecycleEPO = RecycleEPO;
class GothoritaEPO extends gothorita_1.Gothorita {
    constructor() {
        super(...arguments);
        this.setNumber = '45';
        this.fullName = 'Gothorita EPO';
        this.set = 'EPO';
    }
}
exports.GothoritaEPO = GothoritaEPO;
class GothitelleEPO extends gothitelle_1.Gothitelle {
    constructor() {
        super(...arguments);
        this.setNumber = '47';
        this.fullName = 'Gothitelle EPO';
        this.set = 'EPO';
    }
}
exports.GothitelleEPO = GothitelleEPO;
class GreatBallEPO extends great_ball_1.GreatBall {
    constructor() {
        super(...arguments);
        this.setNumber = '93';
        this.fullName = 'Great Ball EPO';
        this.set = 'EPO';
    }
}
exports.GreatBallEPO = GreatBallEPO;
class Tornadus2EPO extends tornadus_1.Tornadus {
    constructor() {
        super(...arguments);
        this.setNumber = '98';
        this.fullName = 'Tornadus2 EPO';
        this.set = 'EPO';
    }
}
exports.Tornadus2EPO = Tornadus2EPO;
