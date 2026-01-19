"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zubat = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Zubat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 50;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Glide',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Double Attack',
                cost: [P],
                damage: 0,
                text: 'Choose 2 of your opponent\'s Benched Pokémon. This attack does 10 damage to each of them. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'UL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '70';
        this.name = 'Zubat';
        this.fullName = 'Zubat UL';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON)(10, effect, store, state, 2, 2);
        }
        return state;
    }
}
exports.Zubat = Zubat;
