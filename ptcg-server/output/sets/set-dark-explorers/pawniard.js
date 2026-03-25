"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pawniard = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Pawniard extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Scratch',
                cost: [C, C],
                damage: 20,
                text: ''
            },
            {
                name: 'Metal Claw',
                cost: [M, M, C],
                damage: 40,
                text: ''
            }
        ];
        this.set = 'DEX';
        this.setNumber = '78';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Pawniard';
        this.fullName = 'Pawniard DEX';
    }
}
exports.Pawniard = Pawniard;
