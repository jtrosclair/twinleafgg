"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Solrock = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Solrock extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Double Draw',
                cost: [C],
                damage: 0,
                text: 'Draw 2 cards.'
            },
            {
                name: 'Solar Heat',
                cost: [F],
                damage: 20,
                damageCalculation: '+',
                text: 'If there is any Stadium card in play, this attack does 20 more damage.'
            }];
        this.set = 'BUS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '69';
        this.name = 'Solrock';
        this.fullName = 'Solrock BUS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.DRAW_CARDS)(effect.player, 2);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            if (game_1.StateUtils.getStadiumCard(state) !== undefined) {
                effect.damage += 20;
            }
        }
        return state;
    }
}
exports.Solrock = Solrock;
