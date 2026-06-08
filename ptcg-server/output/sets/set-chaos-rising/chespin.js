"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chespin = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class Chespin extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 70;
        this.cardType = G;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Beat',
                cost: [G],
                damage: 10,
                text: ''
            },
            {
                name: 'Spike Sting',
                cost: [G, G],
                damage: 30,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '5';
        this.usSetNumber = 'CRI 5';
        this.name = 'Chespin';
        this.fullName = 'Chespin M4';
    }
}
exports.Chespin = Chespin;
