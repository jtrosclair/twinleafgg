"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Baltoy = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Baltoy extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 70;
        this.cardType = F;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Continuous Spin',
                cost: [F],
                damage: 30,
                damageCalculation: 'x',
                text: 'Flip a coin until you get tails. This attack does 30 damage times the number of heads.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '46';
        this.usSetNumber = 'POR 46';
        this.name = 'Baltoy';
        this.fullName = 'Baltoy M4';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, attack_effects_1.FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_DAMAGE_PER_HEADS)(store, state, effect, 30);
        }
        return state;
    }
}
exports.Baltoy = Baltoy;
