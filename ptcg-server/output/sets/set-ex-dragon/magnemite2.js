"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magnemite2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Magnemite2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Random Spark',
                cost: [L],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon.This attack does 10 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
        ];
        this.set = 'DR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '62';
        this.name = 'Magnemite';
        this.fullName = 'Magnemite DR 62';
    }
    reduceEffect(store, state, effect) {
        // Random Spark
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON)(10, effect, store, state);
        }
        return state;
    }
}
exports.Magnemite2 = Magnemite2;
