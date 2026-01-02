"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Piplup = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Piplup extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: L, value: +10 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Peck',
                cost: [],
                damage: 10,
                text: ''
            },
            {
                name: 'Water Splash',
                cost: [W, C],
                damage: 10,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 damage plus 10 more damage.'
            }];
        this.set = 'DP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '93';
        this.name = 'Piplup';
        this.fullName = 'Piplup DP';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 10);
        }
        return state;
    }
}
exports.Piplup = Piplup;
