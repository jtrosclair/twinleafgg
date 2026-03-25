"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dragonair2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dragonair2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Dratini';
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = L;
        this.hp = 70;
        this.weakness = [{ type: C }];
        this.resistance = [{ type: G, value: -30 }, { type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Slam',
                cost: [C, C],
                damage: 20,
                damageCalculation: 'x',
                text: 'Flip 2 coin. This attack does 20 damage times the number of heads.'
            },
            {
                name: 'Dragon Rage',
                cost: [L, C, C],
                damage: 40,
                text: ''
            }];
        this.set = 'DS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '41';
        this.name = 'Dragonair';
        this.fullName = 'Dragonair DS 41';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 2, (results) => {
                effect.damage = 20 * results.filter(result => result).length;
            });
        }
        return state;
    }
}
exports.Dragonair2 = Dragonair2;
