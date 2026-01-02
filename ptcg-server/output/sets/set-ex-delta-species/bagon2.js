"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bagon2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class Bagon2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = R;
        this.hp = 50;
        this.weakness = [{ type: C }];
        this.resistance = [{ type: R, value: -30 }, { type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Ember',
                cost: [R, C],
                damage: 30,
                text: 'Discard a [R] Energy card attached to Bagon.'
            },
        ];
        this.set = 'DS';
        this.name = 'Bagon';
        this.fullName = 'Bagon DS 58';
        this.setNumber = '58';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1, card_types_1.CardType.FIRE);
        }
        return state;
    }
}
exports.Bagon2 = Bagon2;
