"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Beldum = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class Beldum extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 70;
        this.cardType = M;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Headbutt',
                cost: [M],
                damage: 10,
                text: ''
            },
            {
                name: 'Beam',
                cost: [M, C],
                damage: 20,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '57';
        this.name = 'Beldum';
        this.fullName = 'Beldum M4';
    }
}
exports.Beldum = Beldum;
