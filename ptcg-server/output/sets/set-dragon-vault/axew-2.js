"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Axew2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Axew2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = N;
        this.hp = 50;
        this.weakness = [{ type: N }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Lunge',
                cost: [F, M],
                damage: 30,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }
        ];
        this.set = 'DRV';
        this.setNumber = '13';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Axew';
        this.fullName = 'Axew DRV 13';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (!result) {
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.Axew2 = Axew2;
