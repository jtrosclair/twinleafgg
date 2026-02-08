"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LarrysRufflet = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class LarrysRufflet extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.LARRYS];
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Peck the Wound',
                cost: [C, C],
                damage: 20,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon has any damage counters on it, this attack does 80 more damage.'
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '173';
        this.name = 'Larry\'s Rufflet';
        this.fullName = 'Larry\'s Rufflet MC';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.damage > 0) {
                effect.damage = 20 + 80;
            }
        }
        return state;
    }
}
exports.LarrysRufflet = LarrysRufflet;
