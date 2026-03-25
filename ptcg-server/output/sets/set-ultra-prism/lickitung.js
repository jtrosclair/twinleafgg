"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lickitung = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lickitung extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Lap Up',
                cost: [C, C],
                damage: 0,
                text: 'Draw 3 cards.'
            },
            {
                name: 'Slam',
                cost: [C, C, C],
                damage: 50,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 50 damage for each heads.'
            }
        ];
        this.set = 'UPR';
        this.setNumber = '102';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lickitung';
        this.fullName = 'Lickitung UPR';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Lap Up
        // Ref: AGENTS-patterns.md (Draw 3 cards)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.DRAW_CARDS)(effect.player, 3);
        }
        // Attack 2: Slam
        // Ref: set-x-and-y/scolipede.ts (Random Peck - multiple coin flips for damage)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 2, results => {
                effect.damage = 50 * results.filter(r => r).length;
            });
        }
        return state;
    }
}
exports.Lickitung = Lickitung;
