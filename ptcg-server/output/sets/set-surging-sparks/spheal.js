"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spheal = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Spheal extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: M }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Powder Snow',
                cost: [W],
                damage: 10,
                text: 'Your opponent\'s Active Pokémon is now Asleep.'
            }
        ];
        this.set = 'SSP';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '43';
        this.name = 'Spheal';
        this.fullName = 'Spheal SSP';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP)(store, state, effect);
        }
        return state;
    }
}
exports.Spheal = Spheal;
