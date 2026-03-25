"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharizardPLS = exports.CobalionEx2 = exports.ArticunoEx2 = exports.RandomReceiverPLS = exports.BlastoisePLS = exports.Colress2PLS = exports.LugiaEx2PLS = exports.VictiniEX2PLS = exports.EviolitePLS = void 0;
const eviolite_1 = require("../set-noble-victories/eviolite");
const victini_ex_1 = require("../set-plasma-storm/victini-ex");
const lugia_ex_1 = require("../set-plasma-storm/lugia-ex");
const colress_1 = require("../set-plasma-storm/colress");
const blastoise_1 = require("../set-boundaries-crossed/blastoise");
const random_receiver_1 = require("../set-dark-explorers/random-receiver");
const articuno_ex_1 = require("./articuno-ex");
const cobalion_ex_1 = require("./cobalion-ex");
const charizard_1 = require("../set-boundaries-crossed/charizard");
class EviolitePLS extends eviolite_1.Eviolite {
    constructor() {
        super(...arguments);
        this.setNumber = '122';
        this.fullName = 'Eviolite PLS';
        this.set = 'PLS';
    }
}
exports.EviolitePLS = EviolitePLS;
class VictiniEX2PLS extends victini_ex_1.VictiniEX {
    constructor() {
        super(...arguments);
        this.setNumber = '131';
        this.fullName = 'Victini EX2 PLS';
        this.set = 'PLS';
    }
}
exports.VictiniEX2PLS = VictiniEX2PLS;
class LugiaEx2PLS extends lugia_ex_1.LugiaEx {
    constructor() {
        super(...arguments);
        this.setNumber = '134';
        this.fullName = 'Lugia EX2 PLS';
        this.set = 'PLS';
    }
}
exports.LugiaEx2PLS = LugiaEx2PLS;
class Colress2PLS extends colress_1.Colress {
    constructor() {
        super(...arguments);
        this.setNumber = '135';
        this.fullName = 'Colress2 PLS';
        this.set = 'PLS';
    }
}
exports.Colress2PLS = Colress2PLS;
class BlastoisePLS extends blastoise_1.Blastoise {
    constructor() {
        super(...arguments);
        this.setNumber = '137';
        this.fullName = 'Blastoise PLS';
        this.set = 'PLS';
    }
}
exports.BlastoisePLS = BlastoisePLS;
class RandomReceiverPLS extends random_receiver_1.RandomReceiver {
    constructor() {
        super(...arguments);
        this.setNumber = '138';
        this.fullName = 'Random Receiver PLS';
        this.set = 'PLS';
    }
}
exports.RandomReceiverPLS = RandomReceiverPLS;
class ArticunoEx2 extends articuno_ex_1.ArticunoEx {
    constructor() {
        super(...arguments);
        this.set = 'PLS';
        this.setNumber = '132';
        this.fullName = 'Articuno-EX PLS 132';
    }
}
exports.ArticunoEx2 = ArticunoEx2;
class CobalionEx2 extends cobalion_ex_1.CobalionEx {
    constructor() {
        super(...arguments);
        this.set = 'PLS';
        this.setNumber = '133';
        this.fullName = 'Cobalion-EX PLS 133';
    }
}
exports.CobalionEx2 = CobalionEx2;
class CharizardPLS extends charizard_1.Charizard {
    constructor() {
        super(...arguments);
        this.set = 'PLS';
        this.setNumber = '136';
        this.fullName = 'Charizard PLS';
    }
}
exports.CharizardPLS = CharizardPLS;
