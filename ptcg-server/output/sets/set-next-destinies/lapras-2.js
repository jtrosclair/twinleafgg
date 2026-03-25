"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lapras2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Lapras2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 90;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Water Arrow',
                cost: [W, C],
                damage: 0,
                text: 'This attack does 20 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Surf',
                cost: [W, C, C],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'NXD';
        this.setNumber = '26';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lapras';
        this.fullName = 'Lapras NXD 26';
    }
    reduceEffect(store, state, effect) {
        // Water Arrow - 20 damage to any of opponent's Pokémon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON)(20, effect, store, state);
        }
        return state;
    }
}
exports.Lapras2 = Lapras2;
