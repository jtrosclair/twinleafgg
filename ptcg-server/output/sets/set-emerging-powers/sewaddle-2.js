"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sewaddle2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Sewaddle2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 50;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Gnaw',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Razor Leaf',
                cost: [G, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '4';
        this.name = 'Sewaddle';
        this.fullName = 'Sewaddle EPO 4';
    }
}
exports.Sewaddle2 = Sewaddle2;
