"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snivy = void 0;
const game_1 = require("../../game");
class Snivy extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Tackle',
                cost: [G],
                damage: 10,
                text: ''
            }, {
                name: 'Vine Whip',
                cost: [G, G],
                damage: 30,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'BLK';
        this.setNumber = '1';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Snivy';
        this.fullName = 'Snivy SV11B';
    }
}
exports.Snivy = Snivy;
