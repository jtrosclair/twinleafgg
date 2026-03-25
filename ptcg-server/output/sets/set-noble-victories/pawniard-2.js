"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pawniard2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Pawniard2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Iron Head',
                cost: [C],
                damage: 10,
                damageCalculation: 'x',
                text: 'Flip a coin until you get tails. This attack does 10 damage times the number of heads.'
            }];
        this.set = 'NVI';
        this.setNumber = '75';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Pawniard';
        this.fullName = 'Pawniard NVI 75';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.FLIP_UNTIL_TAILS_AND_COUNT_HEADS)(store, state, effect.player, headsCount => {
                effect.damage = 10 * headsCount;
            });
        }
        return state;
    }
}
exports.Pawniard2 = Pawniard2;
