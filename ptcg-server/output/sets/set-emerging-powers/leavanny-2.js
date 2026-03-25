"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Leavanny2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Leavanny2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Swadloon';
        this.cardType = G;
        this.hp = 130;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Slash',
                cost: [C],
                damage: 30,
                text: ''
            },
            {
                name: 'Triple Cutter',
                cost: [G, G, C],
                damage: 60,
                damageCalculation: 'x',
                text: 'Flip 3 coins. This attack does 60 damage times the number of heads.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '8';
        this.name = 'Leavanny';
        this.fullName = 'Leavanny EPO 8';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 3, results => {
                let heads = 0;
                results.forEach(r => { if (r)
                    heads++; });
                effect.damage = 60 * heads;
            });
        }
        return state;
    }
}
exports.Leavanny2 = Leavanny2;
