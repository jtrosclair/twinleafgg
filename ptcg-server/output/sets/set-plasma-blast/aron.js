"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aron = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Aron extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Iron Head',
                cost: [M],
                damage: 10,
                damageCalculation: 'x',
                text: 'Flip a coin until you get tails. This attack does 10 damage times the number of heads.'
            },
            {
                name: 'Headbutt',
                cost: [M, C, C],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'PLB';
        this.setNumber = '57';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Aron';
        this.fullName = 'Aron PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, attack_effects_1.FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_DAMAGE_PER_HEADS)(store, state, effect, 10);
        }
        return state;
    }
}
exports.Aron = Aron;
