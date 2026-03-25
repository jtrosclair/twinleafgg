"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rufflet = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Rufflet extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Peck',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Slash',
                cost: [C, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '86';
        this.name = 'Rufflet';
        this.fullName = 'Rufflet EPO';
    }
}
exports.Rufflet = Rufflet;
