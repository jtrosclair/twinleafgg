"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ralts = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Ralts extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 70;
        this.cardType = P;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Collect',
                cost: [C],
                damage: 0,
                text: 'Draw a card.'
            },
            {
                name: 'Quick Blow',
                cost: [C, C],
                damage: 10,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 10 damage plus 20 more damage.'
            }];
        this.set = 'DS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '81';
        this.name = 'Ralts';
        this.fullName = 'Ralts DS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.DRAW_CARDS)(effect.player, 1);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 20);
        }
        return state;
    }
}
exports.Ralts = Ralts;
