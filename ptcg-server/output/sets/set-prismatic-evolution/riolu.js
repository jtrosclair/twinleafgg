"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Riolu = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Riolu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Quick Attack',
                cost: [F],
                damage: 10,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 more damage.'
            }];
        this.set = 'PRE';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '50';
        this.name = 'Riolu';
        this.fullName = 'Riolu PRE';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 20);
        }
        return state;
    }
}
exports.Riolu = Riolu;
