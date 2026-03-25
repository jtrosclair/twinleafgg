"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Victini3 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Victini3 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'V-blast',
                cost: [P],
                damage: 120,
                text: 'Flip 2 coins. If either of them is tails, this attack does nothing.'
            }
        ];
        this.set = 'NVI';
        this.setNumber = '43';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Victini';
        this.fullName = 'Victini NVI 43';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 2, results => {
                if (!results.every(r => r)) {
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.Victini3 = Victini3;
