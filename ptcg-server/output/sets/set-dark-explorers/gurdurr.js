"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gurdurr = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gurdurr extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Timburr';
        this.cardType = F;
        this.hp = 80;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Low Kick',
                cost: [C],
                damage: 20,
                text: ''
            },
            {
                name: 'Steel Swing',
                cost: [F, C, C],
                damage: 60,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 60 damage times the number of heads.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '59';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Gurdurr';
        this.fullName = 'Gurdurr DEX';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 2, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 60 * heads;
            });
        }
        return state;
    }
}
exports.Gurdurr = Gurdurr;
