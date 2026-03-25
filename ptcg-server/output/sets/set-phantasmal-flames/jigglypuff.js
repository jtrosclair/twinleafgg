"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jigglypuff = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Jigglypuff extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Ball Roll',
                cost: [C],
                damage: 0,
                text: 'Flip a coin until you get tails. This attack does 20 damage times the number of heads.'
            }];
        this.regulationMark = 'I';
        this.set = 'PFL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '76';
        this.name = 'Jigglypuff';
        this.fullName = 'Jigglypuff M2';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.FLIP_UNTIL_TAILS_AND_COUNT_HEADS)(store, state, effect.player, headsCount => {
                effect.damage = 20 * headsCount;
            });
        }
        return state;
    }
}
exports.Jigglypuff = Jigglypuff;
