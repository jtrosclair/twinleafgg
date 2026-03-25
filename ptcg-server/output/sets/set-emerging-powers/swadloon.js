"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swadloon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Swadloon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Sewaddle';
        this.cardType = G;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Gnaw',
                cost: [C],
                damage: 20,
                text: ''
            },
            {
                name: 'Double Razor Leaf',
                cost: [G, C, C],
                damage: 50,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 50 damage times the number of heads.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '5';
        this.name = 'Swadloon';
        this.fullName = 'Swadloon EPO';
    }
    reduceEffect(store, state, effect) {
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
exports.Swadloon = Swadloon;
