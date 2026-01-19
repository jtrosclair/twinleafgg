"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mew = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Mew extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Bench Barrier',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Prevent all damage done to your Benched Pokémon by your opponent\'s attacks.'
            }];
        this.attacks = [{
                name: 'Psypower',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Put 3 damage counters on your opponent\'s Pokémon in any way you like.'
            }];
        this.set = 'UNB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '76';
        this.name = 'Mew';
        this.fullName = 'Mew UNB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_2.PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE)(3, store, state, effect);
        }
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
            // Check if Manaphy is in play on the defending player's field
            let isManaphyInPlay = false;
            defendingPlayer.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (card instanceof Mew) {
                    isManaphyInPlay = true;
                }
            });
            if (!isManaphyInPlay) {
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
exports.Mew = Mew;
