"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eevee2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Eevee2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Smash Kick',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Tail Whap',
                cost: [C, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'DEX';
        this.setNumber = '84';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Eevee';
        this.fullName = 'Eevee DEX 84';
    }
}
exports.Eevee2 = Eevee2;
