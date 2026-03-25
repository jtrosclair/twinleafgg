"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RareCandySS = exports.RaltsSS = exports.MysteriousFossilSS = exports.MarillMisprint = exports.ClawFossilSS = void 0;
const claw_fossil_1 = require("../set-ex-power-keepers/claw-fossil");
const marill_1 = require("./marill");
const mysterious_fossil_1 = require("../set-fossil/mysterious-fossil");
const ralts2_1 = require("../set-ex-dragon-frontiers/ralts2");
const rare_candy_1 = require("../set-ex-holon-phantoms/rare-candy");
class ClawFossilSS extends claw_fossil_1.ClawFossil {
    constructor() {
        super(...arguments);
        this.set = 'SS';
        this.setNumber = '90';
        this.fullName = 'Claw Fossil SS';
    }
}
exports.ClawFossilSS = ClawFossilSS;
// This was a misprint with the wrong retreat cost, but officially ruled to be playable as having the 0 retreat
class MarillMisprint extends marill_1.Marill {
    constructor() {
        super(...arguments);
        this.set = 'SS';
        this.setNumber = '68a';
        this.fullName = 'Marill SS (Misprint)';
        this.retreat = [];
    }
}
exports.MarillMisprint = MarillMisprint;
class MysteriousFossilSS extends mysterious_fossil_1.MysteriousFossil {
    constructor() {
        super(...arguments);
        this.set = 'SS';
        this.setNumber = '91';
        this.fullName = 'Mysterious Fossil SS';
    }
}
exports.MysteriousFossilSS = MysteriousFossilSS;
class RaltsSS extends ralts2_1.Ralts2 {
    constructor() {
        super(...arguments);
        this.set = 'SS';
        this.setNumber = '74';
        this.fullName = 'Ralts SS';
    }
}
exports.RaltsSS = RaltsSS;
class RareCandySS extends rare_candy_1.RareCandy {
    constructor() {
        super(...arguments);
        this.set = 'SS';
        this.setNumber = '88';
        this.fullName = 'Rare Candy SS';
        this.text = 'Choose 1 of your Basic Pokémon in play. If you have a Stage 1 or Stage 2 card that evolves from that Pokémon in your hand, put that card on the Basic Pokémon. (This counts as evolving that Pokémon.)';
    }
}
exports.RareCandySS = RareCandySS;
