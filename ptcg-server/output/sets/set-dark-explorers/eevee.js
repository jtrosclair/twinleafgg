"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eevee = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Eevee extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Surprise Attack',
                cost: [C],
                damage: 20,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '83';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Eevee';
        this.fullName = 'Eevee DEX 83';
    }
    reduceEffect(store, state, effect) {
        // Surprise Attack - if tails, does nothing
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (!result) {
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.Eevee = Eevee;
