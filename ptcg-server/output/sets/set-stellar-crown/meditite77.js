"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedititeSCR77 = void 0;
/* eslint-disable indent */
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class MedititeSCR77 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Beat',
                cost: [F],
                damage: 10,
                text: ''
            },
        ];
        this.regulationMark = 'H';
        this.set = 'SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '77';
        this.name = 'Meditite';
        this.fullName = 'Meditite SCR 77';
    }
}
exports.MedititeSCR77 = MedititeSCR77;
