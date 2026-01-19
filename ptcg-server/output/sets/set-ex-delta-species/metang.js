"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metang = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Metang extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Beldum';
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = L;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Sharp Claws',
                cost: [C, C],
                damage: 20,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 damage plus 10 more damage.'
            },
            {
                name: 'Magnetic Blast',
                cost: [L, C, C],
                damage: 50,
                text: ''
            }];
        this.set = 'DS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '49';
        this.name = 'Metang';
        this.fullName = 'Metang DS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 10);
        }
        return state;
    }
}
exports.Metang = Metang;
