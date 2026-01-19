"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeNull = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TypeNull extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Smash Kick',
                cost: [C],
                damage: 20,
                text: ''
            },
            {
                name: 'Quick Blow',
                cost: [C, C],
                damage: 30,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 30 more damage.'
            }];
        this.set = 'UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '183';
        this.name = 'Type: Null';
        this.fullName = 'Type: Null UNM';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            // Type guard narrows effect to AttackEffect
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 30);
        }
        return state;
    }
}
exports.TypeNull = TypeNull;
