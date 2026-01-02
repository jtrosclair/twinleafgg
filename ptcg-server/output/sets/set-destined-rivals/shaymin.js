"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shaymin = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
class Shaymin extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'I';
        this.cardType = G;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.powers = [{
                name: 'Flower Curtain',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Prevent all damage done to your Benched Pokémon without a Rule Box by attacks from your opponent\'s Pokémon.'
            }];
        this.attacks = [{
                name: 'Smash Kick',
                cost: [C, C],
                damage: 30,
                text: ''
            }];
        this.set = 'DRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '10';
        this.name = 'Shaymin';
        this.fullName = 'Shaymin DRI';
    }
    reduceEffect(store, state, effect) {
        // Flower Curtain
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            // Find the owner of the target (the defending player)
            const defendingPlayer = state_utils_1.StateUtils.findOwner(state, effect.target);
            // Find the owner of the source (the attacking player)
            const attackingPlayer = state_utils_1.StateUtils.findOwner(state, effect.source);
            // Only prevent if the effect is coming from the opponent
            if (attackingPlayer === defendingPlayer) {
                return state;
            }
            // Only prevent if the target is on the bench (not active)
            if (effect.target === defendingPlayer.active) {
                return state;
            }
            // Check if Shaymin is in play on the defending player's field
            let isShayminInPlay = false;
            defendingPlayer.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (card instanceof Shaymin) {
                    isShayminInPlay = true;
                }
            });
            if (!isShayminInPlay) {
                return state;
            }
            // Check if the target has a rule box (Shaymin limitation)
            if (effect.target.hasRuleBox()) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(defendingPlayer, {
                    name: 'test',
                    powerType: pokemon_types_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            effect.preventDefault = true;
        }
        return state;
    }
}
exports.Shaymin = Shaymin;
