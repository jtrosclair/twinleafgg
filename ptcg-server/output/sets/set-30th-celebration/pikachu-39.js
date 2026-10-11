"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachu39 = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
/** #39 — Iron Tail */
class Pikachu39 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 70;
        this.cardType = game_1.CardType.LIGHTNING;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Iron Tail',
                cost: [game_1.CardType.COLORLESS],
                damage: 20,
                damageCalculation: 'x',
                text: 'Flip a coin until you get tails. This attack does 20 damage for each heads.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '39';
        this.name = 'Pikachu';
        this.fullName = 'Pikachu 30C 39';
    }
    reduceEffect(store, state, effect) {
        // Iron Tail
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, attack_effects_1.FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_DAMAGE_PER_HEADS)(store, state, effect, 20);
        }
        return state;
    }
}
exports.Pikachu39 = Pikachu39;
