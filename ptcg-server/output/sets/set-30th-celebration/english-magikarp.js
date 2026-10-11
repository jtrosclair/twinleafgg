"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnglishMagikarpCC30 = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
// Printed English text: https://limitlesstcg.com/cards/30C/CC30 (PAL 42/203).
class EnglishMagikarpCC30 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 30;
        this.cardType = game_1.CardType.WATER;
        this.weakness = [{ type: game_1.CardType.LIGHTNING }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.regulationMark = 'G';
        this.set = '30C';
        this.setNumber = 'CC30';
        this.usSetNumber = '30C CC30';
        this.name = 'Magikarp';
        this.fullName = 'Magikarp 30C CC30';
        this.cardImage = 'assets/cardback.png';
        this.attacks = [{
                name: 'Expert Splasher', cost: [game_1.CardType.WATER], damage: 10, damageCalculation: '+',
                text: 'Flip 2 coins. If both of them are heads, this attack does 20 more damage.'
            }];
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 2, results => {
                if (results.length === 2 && results.every(Boolean)) {
                    effect.damage += 20;
                }
            });
        }
        return state;
    }
}
exports.EnglishMagikarpCC30 = EnglishMagikarpCC30;
