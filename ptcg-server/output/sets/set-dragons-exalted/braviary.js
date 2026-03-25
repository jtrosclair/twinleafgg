"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Braviary = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Braviary extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Rufflet';
        this.cardType = C;
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Slash',
                cost: [C],
                damage: 30,
                text: ''
            },
            {
                name: 'Fury Attack',
                cost: [C, C, C],
                damage: 50,
                damageCalculation: 'x',
                text: 'Flip 3 coins. This attack does 50 damage times the number of heads.'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '112';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Braviary';
        this.fullName = 'Braviary DRX';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 3, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 50 * heads;
            });
        }
        return state;
    }
}
exports.Braviary = Braviary;
