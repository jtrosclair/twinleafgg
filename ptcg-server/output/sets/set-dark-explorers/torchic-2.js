"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Torchic2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Torchic2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 60;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Peck',
                cost: [R],
                damage: 10,
                text: ''
            },
            {
                name: 'Live Coal',
                cost: [R, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'DEX';
        this.setNumber = '15';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Torchic';
        this.fullName = 'Torchic DEX 15';
    }
}
exports.Torchic2 = Torchic2;
