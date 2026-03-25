"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kricketot = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Kricketot extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Beat',
                cost: [G],
                damage: 10,
                text: ''
            },
            {
                name: 'Double Headbutt',
                cost: [G, G],
                damage: 10,
                damageCalculation: '+',
                text: 'Flip 2 coins. This attack does 10 more damage for each heads.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '3';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Kricketot';
        this.fullName = 'Kricketot NXD';
    }
    reduceEffect(store, state, effect) {
        // Double Headbutt
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 2, results => {
                const heads = results.filter(r => r).length;
                effect.damage += 10 * heads;
            });
        }
        return state;
    }
}
exports.Kricketot = Kricketot;
