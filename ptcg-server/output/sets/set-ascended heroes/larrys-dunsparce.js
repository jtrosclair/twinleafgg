"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LarrysDunsparce = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class LarrysDunsparce extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.LARRYS];
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.resistance = [];
        this.retreat = [];
        this.attacks = [{
                name: 'Rising Lunge',
                cost: [C],
                damage: 10,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 more damage.'
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '163';
        this.name = 'Larry\'s Dunsparce';
        this.fullName = 'Larry\'s Dunsparce MC';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, (result) => {
                if (result && effect instanceof game_effects_1.AttackEffect) {
                    effect.damage += 20;
                }
            });
        }
        return state;
    }
}
exports.LarrysDunsparce = LarrysDunsparce;
