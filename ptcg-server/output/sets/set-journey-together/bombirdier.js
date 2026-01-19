"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bombirdier = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Bombirdier extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 120;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Glide',
                cost: [C],
                damage: 20,
                text: ''
            },
            {
                name: 'Drop Shot',
                cost: [D, D, C],
                damage: 0,
                text: 'Discard all Energy from this Pokémon, and this attack does 120 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'JTG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '101';
        this.name = 'Bombirdier';
        this.fullName = 'Bombirdier JTG';
        this.regulationMark = 'H';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.DISCARD_ALL_ENERGY_FROM_POKEMON)(store, state, effect, this);
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON)(120, effect, store, state);
        }
        return state;
    }
}
exports.Bombirdier = Bombirdier;
