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
        this.hp = 70;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Triple Spin',
                cost: [W],
                damage: 20,
                damageCalculation: 'x',
                text: 'Flip 3 coins. This attack does 20 damage times the number of heads.'
            },
            {
                name: 'Frost Breath',
                cost: [W, C, C],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'DEX';
        this.setNumber = '34';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Vanillish';
        this.fullName = 'Vanillish DEX';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 3, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 20 * heads;
            });
        }
        return state;
    }
}
exports.Vanillish = Vanillish;
