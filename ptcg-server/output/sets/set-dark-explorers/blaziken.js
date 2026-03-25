"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blaziken = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const costs_1 = require("../../game/store/prefabs/costs");
class Blaziken extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Combusken';
        this.cardType = R;
        this.hp = 140;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Blaze Kick',
                cost: [R, C],
                damage: 40,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 30 more damage. If tails, the Defending Pokémon is now Burned.'
            },
            {
                name: 'Flamethrower',
                cost: [R, R, C],
                damage: 130,
                text: 'Discard an Energy attached to this Pokémon.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '17';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Blaziken';
        this.fullName = 'Blaziken DEX';
    }
    reduceEffect(store, state, effect) {
        // Blaze Kick attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    // Heads: +30 damage
                    effect.damage += 30;
                }
                else {
                    // Tails: Burn
                    (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED)(store, state, effect);
                }
            });
        }
        // Flamethrower attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1);
        }
        return state;
    }
}
exports.Blaziken = Blaziken;
