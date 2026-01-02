"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Electabuzz = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Electabuzz extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'I';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Electroslug',
                cost: [L, C],
                damage: 50,
                text: ''
            },
        ];
        this.set = 'DRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '68';
        this.name = 'Electabuzz';
        this.fullName = 'Electabuzz DRI';
    }
}
exports.Electabuzz = Electabuzz;
