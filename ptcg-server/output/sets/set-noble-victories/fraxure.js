"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fraxure = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Fraxure extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Axew';
        this.cardType = C;
        this.hp = 90;
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Scratch',
                cost: [C],
                damage: 20,
                text: ''
            }, {
                name: 'Dual Chop',
                cost: [C, C],
                damage: 30,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
            }];
        this.set = 'NVI';
        this.setNumber = '87';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Fraxure';
        this.fullName = 'Fraxure NVI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 2, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 30 * heads;
            });
        }
        return state;
    }
}
exports.Fraxure = Fraxure;
