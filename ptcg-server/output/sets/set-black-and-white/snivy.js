"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snivy = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Snivy extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Tackle',
                cost: [G],
                damage: 10,
                text: ''
            },
            {
                name: 'Vine Whip',
                cost: [G, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '1';
        this.name = 'Snivy';
        this.fullName = 'Snivy BLW 1';
    }
}
exports.Snivy = Snivy;
