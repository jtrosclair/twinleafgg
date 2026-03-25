"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Klang = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Klang extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Klink';
        this.cardType = M;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Vice Grip',
                cost: [C, C],
                damage: 30,
                text: ''
            },
            {
                name: 'Gear Grind',
                cost: [M, M, C],
                damage: 80,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 80 damage times the number of heads.'
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '75';
        this.name = 'Klang';
        this.fullName = 'Klang BLW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 2, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 80 * heads;
            });
        }
        return state;
    }
}
exports.Klang = Klang;
