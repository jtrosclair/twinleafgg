"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ralts = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Ralts extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Psyshot',
                cost: [P],
                damage: 10,
                text: ''
            },
            {
                name: 'Smack',
                cost: [C, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'NXD';
        this.setNumber = '55';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Ralts';
        this.fullName = 'Ralts NXD';
    }
    reduceEffect(store, state, effect) {
        return state;
    }
}
exports.Ralts = Ralts;
