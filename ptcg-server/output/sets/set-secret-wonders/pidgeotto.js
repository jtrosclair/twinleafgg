"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pidgeotto = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Pidgeotto extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pidgey';
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: L, value: +20 }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [];
        this.attacks = [{
                name: 'Wing Attack',
                cost: [C],
                damage: 20,
                text: ''
            },
            {
                name: 'Quick Attack',
                cost: [C, C],
                damage: 30,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 30 damage plus 30 more damage.'
            }];
        this.set = 'SW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '58';
        this.name = 'Pidgeotto';
        this.fullName = 'Pidgeotto SW';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 30);
        }
        return state;
    }
}
exports.Pidgeotto = Pidgeotto;
