"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Maractus = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Maractus extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Mega Drain',
                cost: [G],
                damage: 20,
                text: 'Heal 20 damage from this Pokémon.'
            },
            {
                name: 'Pin Missile',
                cost: [G, G, C],
                damage: 20,
                damageCalculation: 'x',
                text: 'Flip 4 coins. This attack does 20 damage times the number of heads.'
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '11';
        this.name = 'Maractus';
        this.fullName = 'Maractus BLW 11';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(20, effect, store, state);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 4, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 20 * heads;
            });
        }
        return state;
    }
}
exports.Maractus = Maractus;
