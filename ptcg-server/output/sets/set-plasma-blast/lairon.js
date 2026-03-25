"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lairon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Lairon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Aron';
        this.cardType = M;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Metal Claw',
                cost: [M],
                damage: 20,
                text: ''
            },
            {
                name: 'Iron Head',
                cost: [M, C, C],
                damage: 50,
                damageCalculation: 'x',
                text: 'Flip a coin until you get tails. This attack does 50 damage times the number of heads.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '58';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lairon';
        this.fullName = 'Lairon PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            return (0, attack_effects_1.FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_DAMAGE_PER_HEADS)(store, state, effect, 50);
        }
        return state;
    }
}
exports.Lairon = Lairon;
