"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vanillite = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Vanillite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Beat',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Icy Snow',
                cost: [W, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'NXD';
        this.setNumber = '31';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Vanillite';
        this.fullName = 'Vanillite NXD';
    }
    reduceEffect(store, state, effect) {
        return state;
    }
}
exports.Vanillite = Vanillite;
