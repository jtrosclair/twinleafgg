"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playEnergyReducer = void 0;
const play_card_effects_1 = require("../effects/play-card-effects");
const game_error_1 = require("../../game-error");
const game_message_1 = require("../../game-message");
const card_types_1 = require("../card/card-types");
function playEnergyReducer(store, state, effect) {
    /* Play energy card */
    if (effect instanceof play_card_effects_1.AttachEnergyEffect) {
        const pokemonCard = effect.target.getPokemonCard();
        if (pokemonCard === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_TARGET);
        }
        if (effect.energyCard.energyType === card_types_1.EnergyType.SPECIAL
            && effect.player.marker.hasMarker(effect.player.ATTACK_EFFECT_SPECIAL_ENERGY_LOCK)) {
            throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        store.log(state, game_message_1.GameLog.LOG_PLAYER_ATTACHES_CARD, {
            name: effect.player.name,
            card: effect.energyCard.name,
            pokemon: pokemonCard.name
        });
        // Move card to main PokemonCardList first (so it's in the cards array)
        effect.player.hand.moveCardTo(effect.energyCard, effect.target);
        // Then also add it to the energies CardList
        if (!effect.target.energies.cards.includes(effect.energyCard)) {
            effect.target.energies.cards.push(effect.energyCard);
        }
        return state;
    }
    return state;
}
exports.playEnergyReducer = playEnergyReducer;
