"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stunky = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class Stunky extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 70;
        this.cardType = D;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Scratch',
                cost: [D],
                damage: 20,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '52';
        this.usSetNumber = 'CRI 52';
        this.name = 'Stunky';
        this.fullName = 'Stunky M4';
    }
}
exports.Stunky = Stunky;
