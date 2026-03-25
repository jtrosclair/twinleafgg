"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simisage = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Simisage extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pansage';
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Seed Bomb',
                cost: [G],
                damage: 30,
                text: ''
            },
            {
                name: 'Fury Swipes',
                cost: [C, C, C],
                damage: 40,
                damageCalculation: 'x',
                text: 'Flip 3 coins. This attack does 40 damage times the number of heads.'
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '8';
        this.name = 'Simisage';
        this.fullName = 'Simisage BLW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 3, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 40 * heads;
            });
        }
        return state;
    }
}
exports.Simisage = Simisage;
