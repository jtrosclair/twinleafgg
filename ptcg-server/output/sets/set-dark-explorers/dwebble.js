"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dwebble = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Dwebble extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Beat',
                cost: [G],
                damage: 10,
                text: ''
            },
            {
                name: 'Cut',
                cost: [G, C, C],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'DEX';
        this.setNumber = '7';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dwebble';
        this.fullName = 'Dwebble DEX';
    }
}
exports.Dwebble = Dwebble;
