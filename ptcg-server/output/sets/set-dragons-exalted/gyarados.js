"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gyarados = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gyarados extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Magikarp';
        this.cardType = W;
        this.hp = 130;
        this.weakness = [{ type: L }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Sharp Fang',
                cost: [W, C, C],
                damage: 60,
                text: ''
            },
            {
                name: 'Swing Around',
                cost: [W, C, C, C],
                damage: 60,
                damageCalculation: '+',
                text: 'Flip 2 coins. This attack does 30 more damage for each heads.'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '24';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Gyarados';
        this.fullName = 'Gyarados DRX';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 2, results => {
                const heads = results.filter(r => r).length;
                effect.damage += 30 * heads;
            });
        }
        return state;
    }
}
exports.Gyarados = Gyarados;
