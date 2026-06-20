"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikipek = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Pikipek extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Double Stab',
                cost: [C],
                damage: 0,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 10 damage for each heads.'
            },];
        this.set = 'M5';
        this.setNumber = '64';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Pikipek';
        this.fullName = 'Pikipek M5';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 2, results => {
                const heads = results.filter(r => r).length;
                effect.damage += 10 * heads;
            });
        }
        return state;
    }
}
exports.Pikipek = Pikipek;
