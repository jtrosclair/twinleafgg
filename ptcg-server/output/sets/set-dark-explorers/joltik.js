"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Joltik = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Joltik extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 30;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Ram',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Bug Bite',
                cost: [C, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'DEX';
        this.setNumber = '41';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Joltik';
        this.fullName = 'Joltik DEX';
    }
}
exports.Joltik = Joltik;
