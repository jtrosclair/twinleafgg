"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Karrablast = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Karrablast extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Beat',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Reckless Charge',
                cost: [C, C, C],
                damage: 40,
                text: 'This Pokémon does 10 damage to itself.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '9';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Karrablast';
        this.fullName = 'Karrablast DEX';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 10);
        }
        return state;
    }
}
exports.Karrablast = Karrablast;
