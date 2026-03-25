"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magikarp = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Magikarp extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 30;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Soggy Rush',
                cost: [W],
                damage: 10,
                damageCalculation: 'x',
                text: 'Flip a coin until you get tails. This attack does 10 damage times the number of heads.'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '23';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Magikarp';
        this.fullName = 'Magikarp DRX';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, attack_effects_1.FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_DAMAGE_PER_HEADS)(store, state, effect, 10);
        }
        return state;
    }
}
exports.Magikarp = Magikarp;
