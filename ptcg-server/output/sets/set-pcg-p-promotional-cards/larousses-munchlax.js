"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LaRoussesMunchlax = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class LaRoussesMunchlax extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Yawn',
                cost: [C],
                damage: 0,
                text: 'The Defending Pokémon is now Asleep.'
            },
            {
                name: 'Bass Control',
                cost: [C, C],
                damage: 20,
                text: 'Choose 1 of your opponent\'s Pokémon. This attack does 20 damage to that Pokémon.'
            }];
        this.set = 'PCGP';
        this.name = 'LaRousse\'s Munchlax';
        this.fullName = 'LaRousse\'s Munchlax PCGP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '20';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP)(store, state, effect);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON)(20, effect, store, state);
        }
        return state;
    }
}
exports.LaRoussesMunchlax = LaRoussesMunchlax;
