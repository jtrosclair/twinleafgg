"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Luxio2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Luxio2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Shinx';
        this.cardType = L;
        this.hp = 80;
        this.weakness = [{ type: F }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Quick Turn',
                cost: [L],
                damage: 20,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 20 damage times the number of heads.'
            },
            {
                name: 'Bite',
                cost: [C, C],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'NXD';
        this.setNumber = '45';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Luxio';
        this.fullName = 'Luxio NXD 45';
    }
    reduceEffect(store, state, effect) {
        // Quick Turn
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 2, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 20 * heads;
            });
        }
        return state;
    }
}
exports.Luxio2 = Luxio2;
