"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bulbasaur = void 0;
const game_1 = require("../../game");
class Bulbasaur extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R, value: +10 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Tackle',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Vine Whip',
                cost: [G, C],
                damage: 20,
                text: ''
            },
        ];
        this.set = 'SV';
        this.setNumber = '93';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Bulbasaur';
        this.fullName = 'Bulbasaur SV';
    }
}
exports.Bulbasaur = Bulbasaur;
