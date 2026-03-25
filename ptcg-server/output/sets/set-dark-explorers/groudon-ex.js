"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroudonEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class GroudonEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 180;
        this.weakness = [{ type: W }];
        this.resistance = [{ type: L, value: -20 }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Tromp',
                cost: [F, C],
                damage: 20,
                text: 'Does 10 damage to each of your opponent\'s Benched Pokémon. ' +
                    '(Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Giant Claw',
                cost: [F, F, C],
                damage: 80,
                damageCalculation: '+',
                text: 'If the Defending Pokémon already has 2 or more damage counters on it, ' +
                    'this attack does 40 more damage.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '54';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Groudon-EX';
        this.fullName = 'Groudon EX DEX';
    }
    reduceEffect(store, state, effect) {
        // Tromp - 20 damage + 10 to each of opponent's Benched Pokémon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.bench.forEach(benchSlot => {
                if (benchSlot.cards.length > 0) {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 10);
                    damageEffect.target = benchSlot;
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        // Giant Claw - 80 damage, +40 if Defending Pokémon has 2+ damage counters
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            // 2 damage counters = 20 damage
            if (opponent.active.damage >= 20) {
                effect.damage += 40;
            }
        }
        return state;
    }
}
exports.GroudonEx = GroudonEx;
