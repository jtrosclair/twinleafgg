"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alomomola = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Alomomola extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 90;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Mysterious Beam',
                cost: [W, C],
                damage: 30,
                text: 'Flip a coin. If heads, discard an Energy attached to the Defending Pokémon.'
            },
            {
                name: 'Double Slap',
                cost: [W, C, C],
                damage: 50,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 50 damage times the number of heads.'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '37';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Alomomola';
        this.fullName = 'Alomomola DRX';
    }
    reduceEffect(store, state, effect) {
        // Mysterious Beam
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, attack_effects_1.DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON)(store, state, effect);
                }
            });
        }
        // Double Slap
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 2, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 50 * heads;
            });
        }
        return state;
    }
}
exports.Alomomola = Alomomola;
