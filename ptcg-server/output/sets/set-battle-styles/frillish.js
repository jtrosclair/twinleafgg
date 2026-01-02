"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Frillish = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const costs_1 = require("../../game/store/prefabs/costs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Frillish extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 80;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Recover',
                cost: [C],
                damage: 0,
                text: 'Discard an Energy from this Pokémon and heal all damage from it.'
            },
            {
                name: 'Rain Splash',
                cost: [W],
                damage: 10,
                text: ''
            }];
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '41';
        this.name = 'Frillish';
        this.fullName = 'Frillish BST';
        this.regulationMark = 'E';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
            prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 999);
        }
        return state;
    }
}
exports.Frillish = Frillish;
