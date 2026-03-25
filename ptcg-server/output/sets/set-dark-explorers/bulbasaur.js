"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bulbasaur = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Bulbasaur extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Tackle',
                cost: [G],
                damage: 10,
                text: ''
            },
            {
                name: 'Razor Leaf',
                cost: [G, C, C],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'DEX';
        this.setNumber = '1';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Bulbasaur';
        this.fullName = 'Bulbasaur DEX';
    }
}
exports.Bulbasaur = Bulbasaur;
