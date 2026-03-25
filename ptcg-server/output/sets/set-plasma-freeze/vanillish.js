"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vanillish = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Vanillish extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Vanillite';
        this.cardType = W;
        this.hp = 80;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Surefire Spin',
                cost: [C, C],
                damage: 20,
                damageCalculation: '+',
                text: 'Flip 2 coins. If both of them are heads, this attack does 40 more damage.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '28';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Vanillish';
        this.fullName = 'Vanillish PLF';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Surefire Spin - flip 2 coins, +40 if both heads
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 2, results => {
                const allHeads = results.every(r => r);
                if (allHeads) {
                    effect.damage += 40;
                }
            });
        }
        return state;
    }
}
exports.Vanillish = Vanillish;
