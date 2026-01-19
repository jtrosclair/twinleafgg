"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dratini = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dratini extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 40;
        this.retreat = [C];
        this.attacks = [{
                name: 'Dragon Smash',
                cost: [L, W],
                damage: 40,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }];
        this.set = 'EX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '107';
        this.name = 'Dratini';
        this.fullName = 'Dratini EX';
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
exports.Dratini = Dratini;
