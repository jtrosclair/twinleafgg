"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Uxie = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Uxie extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Psypower',
                cost: [P],
                damage: 0,
                text: 'Put 3 damage counters on your opponent\'s Pokémon in any way you like.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '36';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Uxie';
        this.fullName = 'Uxie PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, attack_effects_1.PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE)(3, store, state, effect);
        }
        return state;
    }
}
exports.Uxie = Uxie;
