"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oshawott = void 0;
const game_1 = require("../../game");
class Oshawott extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Tackle',
                cost: [W],
                damage: 10,
                text: ''
            }, {
                name: 'Water Gun',
                cost: [W, W],
                damage: 30,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'WHT';
        this.setNumber = '21';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Oshawott';
        this.fullName = 'Oshawott SV11W';
    }
}
exports.Oshawott = Oshawott;
