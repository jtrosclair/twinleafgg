"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Haxorus = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Haxorus extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Fraxure';
        this.cardType = C;
        this.hp = 140;
        this.weakness = [];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Guillotine',
                cost: [C, C, C],
                damage: 60,
                text: ''
            },
            {
                name: 'Stunning Uppercut',
                cost: [C, C, C, C],
                damage: 80,
                text: 'Flip 2 coins. If both of them are heads, the Defending Pokémon is now Paralyzed. If both of them are tails, this attack does nothing.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '88';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Haxorus';
        this.fullName = 'Haxorus DEX';
    }
    reduceEffect(store, state, effect) {
        // Stunning Uppercut - flip 2 coins
        // Both heads = Paralyzed
        // Both tails = no damage
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 2, results => {
                const heads = results.filter(r => r).length;
                if (heads === 2) {
                    // Both heads - Paralyze the defending Pokémon
                    (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED)(store, state, effect);
                }
                else if (heads === 0) {
                    // Both tails - attack does nothing
                    effect.damage = 0;
                }
                // Otherwise (1 head, 1 tail) - just deal normal damage
            });
        }
        return state;
    }
}
exports.Haxorus = Haxorus;
