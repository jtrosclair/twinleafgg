"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthansCyndaquil = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class EthansCyndaquil extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.ETHANS];
        this.cardType = R;
        this.hp = 70;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Ember',
                cost: [R],
                damage: 30,
                text: 'Discard an Energy from this Pokémon.',
            }
        ];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '32';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Ethan\'s Cyndaquil';
        this.fullName = 'Ethan\'s Cyndaquil DRI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1);
        }
        return state;
    }
}
exports.EthansCyndaquil = EthansCyndaquil;
