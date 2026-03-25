"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrengthCharmMA = exports.DualBallMA = exports.WarpPointMA = void 0;
const escape_rope_1 = require("../set-battle-styles/escape-rope");
const dual_ball_1 = require("../set-unleashed/dual-ball");
const strength_charm_1 = require("../set-ex-dragon-frontiers/strength-charm");
class WarpPointMA extends escape_rope_1.EscapeRope {
    constructor() {
        super(...arguments);
        this.set = 'MA';
        this.setNumber = '85';
        this.name = 'Warp Point';
        this.fullName = 'Warp Point MA';
        this.text = 'Your opponent switches 1 of his or her Defending Pokémon with 1 of his or her Benched Pokémon, if any. You switch 1 of your Active Pokémon with 1 of your Benched Pokémon, if any.';
    }
}
exports.WarpPointMA = WarpPointMA;
class DualBallMA extends dual_ball_1.DualBall {
    constructor() {
        super(...arguments);
        this.set = 'MA';
        this.setNumber = '72';
        this.fullName = 'Dual Ball MA';
        this.text = 'Flip 2 coins. For each heads, search your deck for a Basic Pokémon card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.';
    }
}
exports.DualBallMA = DualBallMA;
class StrengthCharmMA extends strength_charm_1.StrengthCharm {
    constructor() {
        super(...arguments);
        this.set = 'MA';
        this.setNumber = '74';
        this.fullName = 'Strength Charm MA';
    }
}
exports.StrengthCharmMA = StrengthCharmMA;
