"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hippopotas = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Hippopotas extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: W }];
        this.resistance = [{ type: L, value: -20 }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Sand Jet',
                cost: [F],
                damage: 0,
                text: 'Does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Bite',
                cost: [F, C, C],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'NXD';
        this.setNumber = '65';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Hippopotas';
        this.fullName = 'Hippopotas NXD';
    }
    reduceEffect(store, state, effect) {
        // Sand Jet - 20 damage to benched
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON)(20, effect, store, state);
        }
        return state;
    }
}
exports.Hippopotas = Hippopotas;
