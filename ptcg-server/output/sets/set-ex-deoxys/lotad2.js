"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lotad2 = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lotad2 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 50;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Rain Splash',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Aqua Wave',
                cost: [W, C],
                damage: 20,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 damage plus 10 more damage.'
            }];
        this.set = 'DX';
        this.setNumber = '63';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lotad';
        this.fullName = 'Lotad DX 63';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 10);
        }
        return state;
    }
}
exports.Lotad2 = Lotad2;
