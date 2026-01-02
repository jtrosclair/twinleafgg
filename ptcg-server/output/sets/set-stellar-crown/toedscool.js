"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toedscool = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Toedscool extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Ram',
                cost: [G],
                damage: 10,
                text: ''
            },
            {
                name: 'Gentle Slap',
                cost: [G, C],
                damage: 20,
                text: ''
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SCR';
        this.setNumber = '17';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Toedscool';
        this.fullName = 'Toedscool SCR';
    }
}
exports.Toedscool = Toedscool;
