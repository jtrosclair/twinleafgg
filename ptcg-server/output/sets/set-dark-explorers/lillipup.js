"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lillipup = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lillipup extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Tackle',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Take Down',
                cost: [C, C],
                damage: 30,
                text: 'This Pokémon does 10 damage to itself.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '86';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lillipup';
        this.fullName = 'Lillipup DEX';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 10);
        }
        return state;
    }
}
exports.Lillipup = Lillipup;
