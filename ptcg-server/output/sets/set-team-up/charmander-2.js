"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charmander2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class Charmander2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 70;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Ember',
                cost: [R],
                damage: 30,
                text: 'Discard an Energy from this Pokémon.'
            }];
        this.set = 'TEU';
        this.name = 'Charmander';
        this.fullName = 'Charmander TEU2';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '12';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1);
            return state;
        }
        return state;
    }
}
exports.Charmander2 = Charmander2;
