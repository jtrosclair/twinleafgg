"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Larvesta = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Larvesta extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 80;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Ram',
                cost: [C, C],
                damage: 20,
                text: ''
            },
            {
                name: 'Flare',
                cost: [R, R, C],
                damage: 40,
                text: ''
            }
        ];
        this.set = 'DEX';
        this.setNumber = '20';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Larvesta';
        this.fullName = 'Larvesta DEX 20';
    }
    reduceEffect(store, state, effect) {
        return state;
    }
}
exports.Larvesta = Larvesta;
