"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Darumaka = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Darumaka extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 70;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Tackle',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Combustion',
                cost: [R, C, C],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '20';
        this.name = 'Darumaka';
        this.fullName = 'Darumaka EPO';
    }
}
exports.Darumaka = Darumaka;
