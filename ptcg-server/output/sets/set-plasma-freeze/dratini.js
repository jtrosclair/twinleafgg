"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dratini = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dratini extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = N;
        this.hp = 50;
        this.weakness = [{ type: N }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Shed Skin',
                cost: [G],
                damage: 0,
                text: 'Heal 20 damage from this Pokémon.'
            },
            {
                name: 'Tail Smack',
                cost: [L, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'PLF';
        this.setNumber = '81';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dratini';
        this.fullName = 'Dratini PLF';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Shed Skin - heal 20 from this Pokemon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect, store, state, 20);
        }
        return state;
    }
}
exports.Dratini = Dratini;
