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
        this.hp = 40;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Gnaw',
                cost: [C],
                damage: 10,
                text: ''
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
        this.name = 'Joltik';
        this.fullName = 'Joltik EPO';
    }
}
exports.Joltik = Joltik;
