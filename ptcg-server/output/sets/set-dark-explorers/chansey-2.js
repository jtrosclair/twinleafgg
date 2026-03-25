"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chansey2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Chansey2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Continuous Tumble',
                cost: [C, C],
                damage: 30,
                damageCalculation: 'x',
                text: 'Flip a coin until you get tails. This attack does 30 damage times the number of heads.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '81';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Chansey';
        this.fullName = 'Chansey DEX 81';
    }
    reduceEffect(store, state, effect) {
        // Continuous Tumble - flip until tails, damage = 30 x heads
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.FLIP_UNTIL_TAILS_AND_COUNT_HEADS)(store, state, effect.player, headsCount => {
                effect.damage = 30 * headsCount;
            });
        }
        return state;
    }
}
exports.Chansey2 = Chansey2;
