"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poochyena = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Poochyena extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [{
                name: 'Continuous Steps',
                cost: [D],
                damage: 10,
                damageCalculation: 'x',
                text: 'Flip a coin until you get tails. This attack does 10 damage for each heads.'
            },
            {
                name: 'Darkness Fang',
                cost: [D, C],
                damage: 20,
                text: ''
            }];
        this.regulationMark = 'H';
        this.set = 'TWM';
        this.setNumber = '113';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Poochyena';
        this.fullName = 'Poochyena TWM';
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
exports.Poochyena = Poochyena;
