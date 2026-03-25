"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Golett = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Golett extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: D }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Nap',
                cost: [C, C],
                damage: 0,
                text: 'Heal 40 damage from this Pokémon.'
            },
            {
                name: 'Pound',
                cost: [P, C, C],
                damage: 40,
                text: ''
            }
        ];
        this.set = 'DRX';
        this.setNumber = '58';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Golett';
        this.fullName = 'Golett DRX';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect, store, state, 40);
        }
        return state;
    }
}
exports.Golett = Golett;
