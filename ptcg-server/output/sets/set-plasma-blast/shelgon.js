"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shelgon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Shelgon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Bagon';
        this.cardType = N;
        this.hp = 80;
        this.weakness = [{ type: N }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Knock Away',
                cost: [C],
                damage: 10,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 more damage.'
            },
            {
                name: 'Rollout',
                cost: [R, W, C],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'PLB';
        this.setNumber = '63';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Shelgon';
        this.fullName = 'Shelgon PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 20);
        }
        return state;
    }
}
exports.Shelgon = Shelgon;
