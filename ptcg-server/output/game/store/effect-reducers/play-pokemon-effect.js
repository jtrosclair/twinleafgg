"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playPokemonReducer = void 0;
const play_card_effects_1 = require("../effects/play-card-effects");
const game_error_1 = require("../../game-error");
const game_message_1 = require("../../game-message");
const card_types_1 = require("../card/card-types");
const check_effects_1 = require("../effects/check-effects");
const game_effects_1 = require("../effects/game-effects");
/**
 * Helper function to emit animation events
 * @param store - The store instance
 * @param eventName - The name of the animation event
 * @param data - The data to send with the event
 */
function emitAnimationEvent(store, eventName, data) {
    const game = store.handler;
    if (game && game.core && typeof game.core.emitToGame === 'function') {
        game.core.emitToGame(game.id, `game[${game.id}]:${eventName}`, data);
    }
}
function playPokemonReducer(store, state, effect) {
    /* Play pokemon card */
    if (effect instanceof play_card_effects_1.PlayPokemonEffect) {
        const stage = effect.pokemonCard.stage;
        const isBasic = stage === card_types_1.Stage.BASIC;
        if (isBasic && effect.target.cards.length === 0) {
            store.log(state, game_message_1.GameLog.LOG_PLAYER_PLAYS_BASIC_POKEMON, {
                name: effect.player.name,
                card: effect.pokemonCard.name
            });
            effect.player.hand.moveCardTo(effect.pokemonCard, effect.target);
            effect.target.pokemonPlayedTurn = state.turn;
            effect.target.removeSpecialCondition(card_types_1.SpecialCondition.ABILITY_USED);
            // Emit basic animation event
            emitAnimationEvent(store, 'playBasicAnimation', {
                playerId: effect.player.id,
                cardId: effect.pokemonCard.id,
                slot: effect.slot ? String(effect.slot) : undefined,
                index: effect.index
            });
            return state;
        }
        const player = effect.player;
        const isEvolved = stage === card_types_1.Stage.STAGE_1 || card_types_1.Stage.STAGE_2;
        const evolvesFrom = effect.pokemonCard.evolvesFrom;
        const pokemonCard = effect.target.getPokemonCard();
        if (pokemonCard === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_TARGET);
        }
        // Check if evolution is valid using either evolvesFrom or evolvesTo
        const isValidEvolution = (isEvolved && pokemonCard.stage < stage && pokemonCard.name === evolvesFrom) ||
            (isEvolved && pokemonCard.evolvesTo.includes(effect.pokemonCard.name)) ||
            (isEvolved && pokemonCard.evolvesToStage.includes(effect.pokemonCard.stage));
        if (isValidEvolution) {
            const playedTurnEffect = new check_effects_1.CheckPokemonPlayedTurnEffect(effect.player, effect.target);
            store.reduceEffect(state, playedTurnEffect);
            if (state.turn == 0 && player.canEvolve === false) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_EVOLVE_ON_YOUR_FIRST_TURN);
            }
            if (state.turn == 1 && player.canEvolve === false) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_EVOLVE_ON_YOUR_FIRST_TURN);
            }
            if (state.turn == 2 && player.canEvolve === false) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_EVOLVE_ON_YOUR_FIRST_TURN);
            }
            if (playedTurnEffect.pokemonPlayedTurn >= state.turn) {
                throw new game_error_1.GameError(game_message_1.GameMessage.POKEMON_CANT_EVOLVE_THIS_TURN);
            }
            const evolveEffect = new game_effects_1.EvolveEffect(effect.player, effect.target, effect.pokemonCard);
            store.reduceEffect(state, evolveEffect);
            effect.pokemonCard.marker.markers = [];
            effect.player.removePokemonEffects(effect.target);
            if (evolveEffect.keepPoison && effect.target.specialConditions.includes(card_types_1.SpecialCondition.POISONED)) {
                const poisonDamage = effect.target.poisonDamage;
                effect.target.specialConditions = [];
                effect.target.addSpecialCondition(card_types_1.SpecialCondition.POISONED);
                effect.target.poisonDamage = poisonDamage;
            }
            else {
                effect.target.specialConditions = [];
            }
            effect.target.marker.markers = [];
            effect.target.showBasicAnimation = false;
            effect.target.triggerEvolutionAnimation = true;
            if (effect.target.specialConditions.includes(card_types_1.SpecialCondition.ABILITY_USED)) {
                effect.target.removeSpecialCondition(card_types_1.SpecialCondition.ABILITY_USED);
            }
            if (effect.target.boardEffect.includes(card_types_1.BoardEffect.ABILITY_USED)) {
                effect.target.removeBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
            }
            // Emit evolution animation event
            emitAnimationEvent(store, 'evolution', {
                playerId: effect.player.id,
                cardId: effect.pokemonCard.id,
                slot: effect.slot ? String(effect.slot) : undefined,
                index: effect.index
            });
            return state;
        }
        throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_TARGET);
    }
    return state;
}
exports.playPokemonReducer = playPokemonReducer;
