"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timburr = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Timburr extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 60;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Low Kick',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Hammer In',
                cost: [F, C, C],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'DEX';
        this.setNumber = '58';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Timburr';
        this.fullName = 'Timburr DEX';
    }
}
exports.Timburr = Timburr;
