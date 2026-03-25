"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tympole = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Tympole extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Spiral Drain',
                cost: [W, C],
                damage: 20,
                text: 'Heal 20 damage from this Pokémon.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '31';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Tympole';
        this.fullName = 'Tympole DEX';
    }
    reduceEffect(store, state, effect) {
        // Spiral Drain - heal 20 damage from this Pokémon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect, store, state, 20);
        }
        return state;
    }
}
exports.Tympole = Tympole;
