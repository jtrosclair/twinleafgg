"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Watchog = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Watchog extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Patrat';
        this.cardType = C;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Lookout',
                cost: [C],
                damage: 0,
                text: 'Draw 3 cards.'
            },
            {
                name: 'Slam',
                cost: [C, C, C],
                damage: 50,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 50 damage times the number of heads.'
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '79';
        this.name = 'Watchog';
        this.fullName = 'Watchog BLW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.DRAW_CARDS)(effect.player, 3);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 2, results => {
                let heads = 0;
                results.forEach(r => { if (r)
                    heads++; });
                effect.damage = 50 * heads;
            });
        }
        return state;
    }
}
exports.Watchog = Watchog;
