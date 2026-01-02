"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toedscool = void 0;
const game_1 = require("../../game");
class Toedscool extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 60;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Spray Fluid',
                cost: [C],
                damage: 10,
                text: ''
            },
        ];
        this.set = 'JTG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '88';
        this.name = 'Toedscool';
        this.fullName = 'Toedscool JTG';
    }
}
exports.Toedscool = Toedscool;
