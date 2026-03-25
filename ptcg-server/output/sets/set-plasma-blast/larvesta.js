"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Larvesta = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class Larvesta extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 70;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Flare',
                cost: [R],
                damage: 10,
                text: ''
            },
            {
                name: 'Ember',
                cost: [R, C],
                damage: 30,
                text: 'Discard an Energy attached to this Pokémon.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '12';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Larvesta';
        this.fullName = 'Larvesta PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1);
        }
        return state;
    }
}
exports.Larvesta = Larvesta;
