"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scyther = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class Scyther extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Air Slash',
                cost: [C, C, C],
                damage: 60,
                text: 'Discard an Energy attached to this Pokémon.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '4';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Scyther';
        this.fullName = 'Scyther DEX';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1);
        }
        return state;
    }
}
exports.Scyther = Scyther;
