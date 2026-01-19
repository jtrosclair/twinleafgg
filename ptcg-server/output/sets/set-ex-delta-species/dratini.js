"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dratini = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dratini extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = L;
        this.hp = 50;
        this.weakness = [{ type: C }];
        this.resistance = [{ type: G, value: -30 }, { type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Hook',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Thunder Jolt',
                cost: [L, C],
                damage: 30,
                text: 'Flip a coin. If tails, Dratini does 10 damage to itself.'
            }];
        this.set = 'DS';
        this.name = 'Dratini';
        this.fullName = 'Dratini DS';
        this.setNumber = '65';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, (result) => {
                if (!result) {
                    (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 10);
                }
            });
        }
        return state;
    }
}
exports.Dratini = Dratini;
