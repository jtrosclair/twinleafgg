"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grubbin = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Grubbin extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Vice Grip',
                cost: [C, C],
                damage: 20,
                text: ''
            },
        ];
        this.set = 'SUM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '13';
        this.name = 'Grubbin';
        this.fullName = 'Grubbin SUM';
    }
}
exports.Grubbin = Grubbin;
