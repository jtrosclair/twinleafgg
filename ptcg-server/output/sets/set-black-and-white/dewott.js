"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dewott = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Dewott extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Oshawott';
        this.cardType = W;
        this.hp = 90;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Water Gun',
                cost: [C, C],
                damage: 30,
                text: ''
            },
            {
                name: 'Razor Shell',
                cost: [W, W, C],
                damage: 40,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 more damage.'
            }];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '29';
        this.name = 'Dewott';
        this.fullName = 'Dewott BLW 29';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 20);
        }
        return state;
    }
}
exports.Dewott = Dewott;
