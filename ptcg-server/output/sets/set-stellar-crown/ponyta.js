"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ponyta = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Ponyta extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 70;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Flop',
                cost: [R],
                damage: 10,
                text: ''
            }
        ];
        this.set = 'SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '19';
        this.name = 'Ponyta';
        this.fullName = 'Ponyta SCR';
        this.regulationMark = 'H';
    }
}
exports.Ponyta = Ponyta;
