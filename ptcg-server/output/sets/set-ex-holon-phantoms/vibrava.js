"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vibrava = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Vibrava extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.cardType = G;
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Trapinch';
        this.tags = [game_1.CardTag.DELTA_SPECIES];
        this.hp = 80;
        this.weakness = [{ type: C }];
        this.resistance = [{ type: L, value: -30 }, { type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Knock Away',
                cost: [C, C],
                damage: 20,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 damage plus 10 more damage.'
            },
            {
                name: 'Cutting Wind',
                cost: [G, C, C],
                damage: 40,
                text: ''
            }];
        this.set = 'HP';
        this.setNumber = '54';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Vibrava';
        this.fullName = 'Vibrava HP';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 10);
        }
        return state;
    }
}
exports.Vibrava = Vibrava;
