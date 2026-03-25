"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Treecko = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Treecko extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 50;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Tail Smash',
                cost: [G],
                damage: 10,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }];
        this.set = 'EM';
        this.setNumber = '70';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Treecko';
        this.fullName = 'Treecko EM';
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
exports.Treecko = Treecko;
