"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Galvantula = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Galvantula extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Joltik';
        this.cardType = L;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Stun Needle',
                cost: [L],
                damage: 20,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokemon is now Paralyzed.',
            },
            {
                name: 'Shocking Pursuit',
                cost: [L, C],
                damage: 0,
                damageCalculation: 'x',
                text: 'This attack does 20 damage for each damage counter on your opponent\'s Active Pokemon.'
            }
        ];
        this.set = 'VIV';
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '56';
        this.name = 'Galvantula';
        this.fullName = 'Galvantula VIV';
    }
    reduceEffect(store, state, effect) {
        // Stun Needle
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => {
                if (result) {
                    prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
                }
            });
        }
        {
            // Shocking Pursuit
            if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
                const opponent = game_1.StateUtils.getOpponent(state, effect.player);
                prefabs_1.THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 2 * opponent.active.damage);
            }
            return state;
        }
    }
}
exports.Galvantula = Galvantula;
