"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dragonite = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Dragonite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Dragonair';
        this.cardType = N;
        this.hp = 150;
        this.weakness = [{ type: N }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Hyper Beam',
                cost: [L, C, C],
                damage: 50,
                text: 'Flip a coin. If heads, discard an Energy attached to the Defending Pok\u00e9mon.'
            },
            {
                name: 'Hurricane Tail',
                cost: [G, C, C, C],
                damage: 60,
                damageCalculation: 'x',
                text: 'Flip 4 coins. This attack does 60 damage times the number of heads.'
            }
        ];
        this.set = 'DRV';
        this.setNumber = '5';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dragonite';
        this.fullName = 'Dragonite DRV';
    }
    reduceEffect(store, state, effect) {
        // Hyper Beam - flip for energy discard
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, attack_effects_1.DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON)(store, state, effect);
                }
            });
        }
        // Hurricane Tail - flip 4, 60x heads
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 4, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 60 * heads;
            });
        }
        return state;
    }
}
exports.Dragonite = Dragonite;
