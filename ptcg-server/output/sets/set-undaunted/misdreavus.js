"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Misdreavus = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Misdreavus extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: P }];
        this.resistance = [{ type: C, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Mummble',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Dual Draw',
                cost: [P],
                damage: 0,
                text: 'Each player draws 3 cards.'
            }];
        this.set = 'UD';
        this.name = 'Misdreavus';
        this.fullName = 'Misdreavus UD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '57';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.DRAW_CARDS)(effect.player, 3);
            (0, prefabs_1.DRAW_CARDS)(effect.opponent, 3);
        }
        return state;
    }
}
exports.Misdreavus = Misdreavus;
