"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Teddiursa = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Teddiursa extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Fury Swipes',
                cost: [C, C],
                damage: 10,
                damageCalculation: 'x',
                text: 'Flip 3 coins. This attack does 10 damage times the number of heads.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '75';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Teddiursa';
        this.fullName = 'Teddiursa PLB';
    }
    reduceEffect(store, state, effect) {
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
exports.Teddiursa = Teddiursa;
