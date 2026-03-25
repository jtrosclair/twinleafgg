"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bronzor = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Bronzor extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Knock Away',
                cost: [M, C],
                damage: 10,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 10 more damage.'
            },
            {
                name: 'Spinning Attack',
                cost: [M, C, C],
                damage: 40,
                text: ''
            }
        ];
        this.set = 'NXD';
        this.setNumber = '75';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Bronzor';
        this.fullName = 'Bronzor NXD';
    }
    reduceEffect(store, state, effect) {
        // Knock Away
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    effect.damage += 10;
                }
            });
        }
        return state;
    }
}
exports.Bronzor = Bronzor;
