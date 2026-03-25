"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cubchoo2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Cubchoo2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: M }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Icicle Punch',
                cost: [W, W],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '29';
        this.name = 'Cubchoo';
        this.fullName = 'Cubchoo EPO 29';
    }
}
exports.Cubchoo2 = Cubchoo2;
