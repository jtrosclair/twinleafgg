"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bisharp2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Bisharp2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pawniard';
        this.cardType = M;
        this.hp = 100;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Aerial Ace',
                cost: [C, C],
                damage: 20,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 more damage.'
            },
            {
                name: 'Metal Claw',
                cost: [M, M, C],
                damage: 80,
                text: ''
            }
        ];
        this.set = 'DEX';
        this.setNumber = '79';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Bisharp';
        this.fullName = 'Bisharp DEX 79';
    }
    reduceEffect(store, state, effect) {
        // Aerial Ace - flip a coin, if heads +20 damage
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 20);
        }
        return state;
    }
}
exports.Bisharp2 = Bisharp2;
