"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Natu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Natu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 30;
        this.weakness = [{ type: P }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [];
        this.attacks = [{
                name: 'Peck',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Telekinesis',
                cost: [P, P],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon. This attack does 20 damage to that Pokémon. Don\'t apply Weakness and Resistance for this attack. (Any other effects that would happen after applying Weakness and Resistance still happen.)'
            }];
        this.set = 'N1';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '67';
        this.name = 'Natu';
        this.fullName = 'Natu N1';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON)(20, effect, store, state, 1, 1, false);
        }
        return state;
    }
}
exports.Natu = Natu;
