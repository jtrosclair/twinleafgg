"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Porygon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class Porygon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Sharpen',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Recover',
                cost: [C, C],
                damage: 0,
                text: 'Discard an Energy attached to Porygon and remove 4 damage counters from Porygon.'
            }
        ];
        this.set = 'TM';
        this.setNumber = '73';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Porygon';
        this.fullName = 'Porygon TM';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
            prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 40);
        }
        return state;
    }
}
exports.Porygon = Porygon;
