"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vanillite = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Vanillite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 50;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Double Spin',
                cost: [C],
                damage: 10,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 10 damage times the number of heads.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '33';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Vanillite';
        this.fullName = 'Vanillite DEX';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 2, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 10 * heads;
            });
        }
        return state;
    }
}
exports.Vanillite = Vanillite;
