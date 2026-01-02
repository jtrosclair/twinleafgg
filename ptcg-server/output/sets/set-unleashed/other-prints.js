"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlusPowerUL = exports.CheerleadersCheerUL = exports.JirachiUL = exports.SuperScoopUpUL = exports.RareCandyUL = exports.JudgeUL = void 0;
const jirachi_1 = require("../set-call-of-legends/jirachi");
const cheerleaders_cheer_1 = require("../set-call-of-legends/cheerleaders-cheer");
const pluspower_1 = require("../set-base-set/pluspower");
const judge_1 = require("../set-scarlet-and-violet/judge");
const rare_candy_1 = require("../set-ex-holon-phantoms/rare-candy");
const super_scoop_up_1 = require("../set-diamond-and-pearl/super-scoop-up");
class JudgeUL extends judge_1.Judge {
    constructor() {
        super(...arguments);
        this.fullName = 'Judge UL';
        this.name = 'Judge';
        this.set = 'UL';
        this.setNumber = '78';
        this.text = 'Each player shuffles his or her hand into his or her deck and draws 4 cards.';
    }
}
exports.JudgeUL = JudgeUL;
class RareCandyUL extends rare_candy_1.RareCandy {
    constructor() {
        super(...arguments);
        this.fullName = 'Rare Candy UL';
        this.name = 'Rare Candy';
        this.set = 'UL';
        this.setNumber = '82';
        this.text = 'Choose 1 of your Basic Pokémon in play. If you have a Stage 1 or Stage 2 card that evolves from that Pokémon in your hand, put that card on the Basic Pokémon. (This counts as evolving that Pokémon.) If you choose a Stage 2 Pokémon in your hand, put that Pokémon on the Basic Pokémon instead of on a Stage 1 Pokémon.';
    }
}
exports.RareCandyUL = RareCandyUL;
class SuperScoopUpUL extends super_scoop_up_1.SuperScoopUp {
    constructor() {
        super(...arguments);
        this.fullName = 'Super Scoop Up UL';
        this.name = 'Super Scoop Up';
        this.set = 'UL';
        this.setNumber = '83';
        this.text = 'Flip a coin. If heads, return 1 of your Pokémon and all cards attached to it to your hand.';
    }
}
exports.SuperScoopUpUL = SuperScoopUpUL;
class JirachiUL extends jirachi_1.Jirachi {
    constructor() {
        super(...arguments);
        this.setNumber = '1';
        this.fullName = 'Jirachi UL';
        this.set = 'UL';
    }
}
exports.JirachiUL = JirachiUL;
class CheerleadersCheerUL extends cheerleaders_cheer_1.CheerleadersCheer {
    constructor() {
        super(...arguments);
        this.setNumber = '71';
        this.fullName = 'Cheerleader\'s Cheer UL';
        this.set = 'UL';
    }
}
exports.CheerleadersCheerUL = CheerleadersCheerUL;
class PlusPowerUL extends pluspower_1.PlusPower {
    constructor() {
        super(...arguments);
        this.setNumber = '80';
        this.fullName = 'PlusPower UL';
        this.set = 'UL';
    }
}
exports.PlusPowerUL = PlusPowerUL;
