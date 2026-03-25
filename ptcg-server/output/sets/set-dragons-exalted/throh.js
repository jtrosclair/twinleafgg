"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Throh = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Throh extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 100;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Squeeze',
                cost: [F, C, C],
                damage: 40,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 more damage and the Defending Pokémon is now Paralyzed.'
            },
            {
                name: 'Superpower',
                cost: [F, C, C, C],
                damage: 70,
                damageCalculation: '+',
                text: 'You may do 20 more damage. If you do, this Pokémon does 20 damage to itself.'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '68';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Throh';
        this.fullName = 'Throh DRX';
    }
    reduceEffect(store, state, effect) {
        // Squeeze
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    effect.damage += 20;
                    (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED)(store, state, effect);
                }
            });
        }
        // Superpower
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    effect.damage += 20;
                    (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 20);
                }
            });
        }
        return state;
    }
}
exports.Throh = Throh;
