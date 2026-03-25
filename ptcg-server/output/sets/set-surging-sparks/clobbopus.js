"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clobbopus = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Clobbopus extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Slight Intrusion',
                cost: [F],
                damage: 30,
                text: 'This Pokémon also does 10 damage to itself.'
            }
        ];
        this.set = 'SSP';
        this.setNumber = '112';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Clobbopus';
        this.fullName = 'Clobbopus SSP';
    }
    reduceEffect(store, state, effect) {
        // Slight Intrusion
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 10);
        }
        return state;
    }
}
exports.Clobbopus = Clobbopus;
