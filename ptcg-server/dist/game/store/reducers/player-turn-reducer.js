"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerTurnReducer = void 0;
const game_actions_1 = require("../actions/game-actions");
const state_1 = require("../state/state");
const game_error_1 = require("../../game-error");
const game_message_1 = require("../../game-message");
const game_effects_1 = require("../effects/game-effects");
const game_phase_effects_1 = require("../effects/game-phase-effects");
const state_utils_1 = require("../state-utils");
const play_card_action_1 = require("../actions/play-card-action");
const pokemon_card_1 = require("../card/pokemon-card");
const check_effects_1 = require("../effects/check-effects");
const trainer_card_1 = require("../card/trainer-card");
const energy_card_1 = require("../card/energy-card");
function playerTurnReducer(store, state, action) {
    if (state.phase === state_1.GamePhase.PLAYER_TURN) {
        if (action instanceof game_actions_1.PassTurnAction) {
            const player = state.players[state.activePlayer];
            if (player === undefined || player.id !== action.clientId) {
                throw new game_error_1.GameError(game_message_1.GameMessage.NOT_YOUR_TURN);
            }
            const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
            state = store.reduceEffect(state, endTurnEffect);
            return state;
        }
        if (action instanceof game_actions_1.RetreatAction) {
            const player = state.players[state.activePlayer];
            if (player === undefined || player.id !== action.clientId) {
                throw new game_error_1.GameError(game_message_1.GameMessage.NOT_YOUR_TURN);
            }
            const retreatEffect = new game_effects_1.RetreatEffect(player, action.benchIndex);
            state = store.reduceEffect(state, retreatEffect);
            player.active.clearEffects();
            return state;
        }
        if (action instanceof game_actions_1.RetreatStartAction) {
            const player = state.players[state.activePlayer];
            if (player === undefined || player.id !== action.clientId) {
                throw new game_error_1.GameError(game_message_1.GameMessage.NOT_YOUR_TURN);
            }
            state = store.reduceEffect(state, new game_effects_1.RetreatStartEffect(player));
            return state;
        }
        if (action instanceof game_actions_1.AttackAction) {
            const player = state.players[state.activePlayer];
            if (player === undefined || player.id !== action.clientId) {
                throw new game_error_1.GameError(game_message_1.GameMessage.NOT_YOUR_TURN);
            }
            const pokemonCard = player.active.getPokemonCard();
            let attacks = [];
            if (pokemonCard) {
                attacks = [...pokemonCard.attacks];
            }
            // Add bench attacks
            player.bench.forEach(benchSlot => {
                const benchPokemon = benchSlot.getPokemonCard();
                if (benchPokemon && benchPokemon.attacks.some(attack => attack.useOnBench)) {
                    const benchAttacks = benchPokemon.attacks.filter(attack => attack.useOnBench);
                    attacks.push(...benchAttacks);
                    const attackEffect = new check_effects_1.CheckPokemonAttacksEffect(player);
                    state = store.reduceEffect(state, attackEffect);
                    attacks = [...attacks, ...attackEffect.attacks];
                }
            });
            const attackEffect = new check_effects_1.CheckPokemonAttacksEffect(player);
            state = store.reduceEffect(state, attackEffect);
            attacks = [...attacks, ...attackEffect.attacks];
            const attack = attacks.find(a => a.name === action.name);
            if (attack === undefined) {
                throw new game_error_1.GameError(game_message_1.GameMessage.UNKNOWN_ATTACK);
            }
            const useAttackEffect = new game_effects_1.UseAttackEffect(player, attack);
            state = store.reduceEffect(state, useAttackEffect);
            state.lastAttack = attack;
            if (!state.playerLastAttack) {
                state.playerLastAttack = {};
            }
            if (pokemonCard) {
                state.playerLastAttack[player.id] = { attack, sourceCard: pokemonCard };
            }
            return state;
        }
        if (action instanceof game_actions_1.UseAbilityAction) {
            const player = state.players[state.activePlayer];
            if (player === undefined || player.id !== action.clientId) {
                throw new game_error_1.GameError(game_message_1.GameMessage.NOT_YOUR_TURN);
            }
            let pokemonCard;
            switch (action.target.slot) {
                case play_card_action_1.SlotType.ACTIVE:
                case play_card_action_1.SlotType.BENCH: {
                    const target = state_utils_1.StateUtils.getTarget(state, player, action.target);
                    pokemonCard = target.getPokemonCard();
                    break;
                }
                case play_card_action_1.SlotType.DISCARD: {
                    const discardCard = player.discard.cards[action.target.index];
                    if (discardCard instanceof pokemon_card_1.PokemonCard
                        && discardCard.powers.some(p => p.name === action.name && p.useFromDiscard)) {
                        pokemonCard = discardCard;
                    }
                    else {
                        // The index may be stale (e.g. an identical copy already left the discard
                        // earlier this turn), so fall back to any copy in the discard that exposes
                        // the requested useFromDiscard power. Identical copies are interchangeable.
                        pokemonCard = player.discard.cards.find((c) => c instanceof pokemon_card_1.PokemonCard
                            && c.powers.some(p => p.name === action.name && p.useFromDiscard));
                    }
                    break;
                }
                case play_card_action_1.SlotType.HAND: {
                    const handCard = player.hand.cards[action.target.index];
                    if (handCard instanceof pokemon_card_1.PokemonCard
                        && handCard.powers.some(p => p.name === action.name && p.useFromHand)) {
                        pokemonCard = handCard;
                    }
                    else {
                        pokemonCard = player.hand.cards.find((c) => c instanceof pokemon_card_1.PokemonCard
                            && c.powers.some(p => p.name === action.name && p.useFromHand));
                    }
                    break;
                }
            }
            if (pokemonCard !== undefined) {
                //throw new GameError(GameMessage.INVALID_TARGET);
                let power;
                if (action.target.slot === play_card_action_1.SlotType.ACTIVE || action.target.slot === play_card_action_1.SlotType.BENCH) {
                    const target = state_utils_1.StateUtils.getTarget(state, player, action.target);
                    const targetPokemon = target.getPokemonCard();
                    if (!targetPokemon) {
                        throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_TARGET);
                    }
                    const powersEffect = new check_effects_1.CheckPokemonPowersEffect(player, targetPokemon);
                    state = store.reduceEffect(state, powersEffect);
                    power = [...pokemonCard.powers, ...powersEffect.powers].find(a => a.name === action.name);
                }
                else {
                    power = pokemonCard.powers.find(a => a.name === action.name);
                }
                if (power === undefined) {
                    throw new game_error_1.GameError(game_message_1.GameMessage.UNKNOWN_POWER);
                }
                const slot = action.target.slot;
                if (slot === play_card_action_1.SlotType.ACTIVE || slot === play_card_action_1.SlotType.BENCH) {
                    if (!power.useWhenInPlay) {
                        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
                    }
                }
                if (slot === play_card_action_1.SlotType.HAND && !power.useFromHand) {
                    throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
                }
                if (slot === play_card_action_1.SlotType.DISCARD && !power.useFromDiscard) {
                    throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
                }
                state = store.reduceEffect(state, new game_effects_1.UsePowerEffect(player, power, pokemonCard, action.target));
                return state;
            }
        }
        if (action instanceof game_actions_1.UseTrainerAbilityAction) {
            const player = state.players[state.activePlayer];
            if (player === undefined || player.id !== action.clientId) {
                throw new game_error_1.GameError(game_message_1.GameMessage.NOT_YOUR_TURN);
            }
            let trainerCard;
            const discardCard = player.discard.cards[action.target.index];
            if (discardCard instanceof trainer_card_1.TrainerCard
                && discardCard.powers.some(p => p.name === action.name && p.useFromDiscard)) {
                trainerCard = discardCard;
            }
            else {
                // The index may be stale if an identical copy already left the discard this turn.
                trainerCard = player.discard.cards.find((c) => c instanceof trainer_card_1.TrainerCard
                    && c.powers.some(p => p.name === action.name && p.useFromDiscard));
            }
            if (trainerCard !== undefined) {
                let power;
                if (action.target.slot === play_card_action_1.SlotType.DISCARD) {
                    power = trainerCard.powers.find(a => a.name === action.name);
                }
                if (power === undefined) {
                    throw new game_error_1.GameError(game_message_1.GameMessage.UNKNOWN_POWER);
                }
                const slot = action.target.slot;
                if (slot === play_card_action_1.SlotType.DISCARD && !power.useFromDiscard) {
                    throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
                }
                state = store.reduceEffect(state, new game_effects_1.UseTrainerPowerEffect(player, power, trainerCard, action.target));
                return state;
            }
        }
        if (action instanceof game_actions_1.UseEnergyAbilityAction) {
            const player = state.players[state.activePlayer];
            if (player === undefined || player.id !== action.clientId) {
                throw new game_error_1.GameError(game_message_1.GameMessage.NOT_YOUR_TURN);
            }
            let energyCard;
            const discardCard = player.discard.cards[action.target.index];
            if (discardCard instanceof energy_card_1.EnergyCard
                && discardCard.powers.some(p => p.name === action.name && p.useFromDiscard)) {
                energyCard = discardCard;
            }
            else {
                // The index may be stale if an identical copy already left the discard this turn.
                energyCard = player.discard.cards.find((c) => c instanceof energy_card_1.EnergyCard
                    && c.powers.some(p => p.name === action.name && p.useFromDiscard));
            }
            if (energyCard !== undefined) {
                let power;
                if (action.target.slot === play_card_action_1.SlotType.DISCARD) {
                    power = energyCard.powers.find(a => a.name === action.name);
                }
                if (power === undefined) {
                    throw new game_error_1.GameError(game_message_1.GameMessage.UNKNOWN_POWER);
                }
                const slot = action.target.slot;
                if (slot === play_card_action_1.SlotType.DISCARD && !power.useFromDiscard) {
                    throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
                }
                state = store.reduceEffect(state, new game_effects_1.UseEnergyPowerEffect(player, power, energyCard, action.target));
                return state;
            }
        }
        if (action instanceof game_actions_1.UseStadiumAction) {
            const player = state.players[state.activePlayer];
            if (player === undefined || player.id !== action.clientId) {
                throw new game_error_1.GameError(game_message_1.GameMessage.NOT_YOUR_TURN);
            }
            if (player.stadiumUsedTurn === state.turn) {
                throw new game_error_1.GameError(game_message_1.GameMessage.STADIUM_ALREADY_USED);
            }
            const stadium = state_utils_1.StateUtils.getStadiumCard(state);
            if (stadium === undefined) {
                throw new game_error_1.GameError(game_message_1.GameMessage.NO_STADIUM_IN_PLAY);
            }
            state = store.reduceEffect(state, new game_effects_1.UseStadiumEffect(player, stadium));
            return state;
        }
    }
    return state;
}
exports.playerTurnReducer = playerTurnReducer;
