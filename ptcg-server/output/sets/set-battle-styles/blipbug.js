"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blipbug = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Blipbug extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 50;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Stampede',
                cost: [P],
                damage: 10,
                text: ''
            },
        ];
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '17';
        this.name = 'Blipbug';
        this.fullName = 'Blipbug BST';
    }
}
exports.Blipbug = Blipbug;
