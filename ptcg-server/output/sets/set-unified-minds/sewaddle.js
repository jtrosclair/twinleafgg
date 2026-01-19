"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sewaddle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Sewaddle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 50;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.powers = [{
                name: 'Swaddling Leaves',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'This Pokémon takes 10 less damage from attacks (after applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Surprise Attack',
                cost: [G],
                damage: 20,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }];
        this.set = 'UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '7';
        this.name = 'Sewaddle';
        this.fullName = 'Sewaddle UNM';
    }
    reduceEffect(store, state, effect) {
        // Swaddling Leaves: reduce damage taken by 10 after Weakness/Resistance
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            // It's not this pokemon card
            if (pokemonCard !== this) {
                return state;
            }
            // It's not an attack
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            const player = game_1.StateUtils.findOwner(state, effect.target);
            // Try to reduce PowerEffect, to check if something is blocking our ability
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            effect.damage = Math.max(0, effect.damage - 10);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (!result) {
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.Sewaddle = Sewaddle;
