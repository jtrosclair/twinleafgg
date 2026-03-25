"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weedle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Weedle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 50;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Triple Stab',
                cost: [G],
                damage: 10,
                damageCalculation: 'x',
                text: 'Flip 3 coins. This attack does 10 damage times the number of heads.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '1';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Weedle';
        this.fullName = 'Weedle PLF';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Triple Stab - flip 3 coins, 10x heads
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 3, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 10 * heads;
            });
        }
        return state;
    }
}
exports.Weedle = Weedle;
