"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Carvanha = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Carvanha extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Bite',
                cost: [C],
                damage: 10,
                text: ''
            }
        ];
        this.set = 'GRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '27';
        this.name = 'Carvanha';
        this.fullName = 'Carvanha GRI';
    }
}
exports.Carvanha = Carvanha;
