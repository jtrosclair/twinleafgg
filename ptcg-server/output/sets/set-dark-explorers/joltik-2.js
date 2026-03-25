"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Joltik2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Joltik2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 30;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Static Shock',
                cost: [L],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'DEX';
        this.setNumber = '42';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Joltik';
        this.fullName = 'Joltik DEX 42';
    }
}
exports.Joltik2 = Joltik2;
