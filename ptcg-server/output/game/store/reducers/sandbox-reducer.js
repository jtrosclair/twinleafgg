"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sandboxReducer = void 0;
const game_error_1 = require("../../game-error");
const game_message_1 = require("../../game-message");
const sandbox_modify_player_action_1 = require("../actions/sandbox-modify-player-action");
const sandbox_modify_game_state_action_1 = require("../actions/sandbox-modify-game-state-action");
const sandbox_modify_card_action_1 = require("../actions/sandbox-modify-card-action");
const sandbox_modify_pokemon_action_1 = require("../actions/sandbox-modify-pokemon-action");
const card_manager_1 = require("../../cards/card-manager");
const card_types_1 = require("../card/card-types");
function sandboxReducer(store, state, action, clientRoleId) {
    // Validate sandbox mode is enabled
    if (!state.gameSettings.sandboxMode) {
        throw new game_error_1.GameError(game_message_1.GameMessage.ILLEGAL_ACTION);
    }
    // Validate user is admin (roleId === 4)
    if (clientRoleId !== 4) {
        throw new game_error_1.GameError(game_message_1.GameMessage.ILLEGAL_ACTION);
    }
    if (action instanceof sandbox_modify_player_action_1.SandboxModifyPlayerAction) {
        const player = state.players.find(p => p.id === action.targetPlayerId);
        if (!player) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ILLEGAL_ACTION);
        }
        const mods = action.modifications;
        // Modify prizes
        if (mods.prizes !== undefined) {
            const currentPrizes = player.getPrizeLeft();
            const diff = mods.prizes - currentPrizes;
            if (diff > 0) {
                // Add prizes - take cards from top of deck
                let addedCount = 0;
                for (let i = 0; i < player.prizes.length && addedCount < diff; i++) {
                    if (player.prizes[i].cards.length === 0 && player.deck.cards.length > 0) {
                        // Move one card from top of deck to this prize slot
                        player.deck.moveTo(player.prizes[i], 1);
                        addedCount++;
                    }
                }
            }
            else if (diff < 0) {
                // Remove prizes - move cards to hand
                let removedCount = 0;
                // Process from highest index to avoid index shifting issues
                for (let i = player.prizes.length - 1; i >= 0 && removedCount < Math.abs(diff); i--) {
                    if (player.prizes[i].cards.length > 0) {
                        // Move all cards from this prize slot to hand
                        player.prizes[i].moveTo(player.hand);
                        removedCount++;
                    }
                }
            }
        }
        // Modify hand size
        if (mods.handSize !== undefined) {
            const diff = mods.handSize - player.hand.cards.length;
            if (diff > 0) {
                // Add cards to hand
                const cardManager = card_manager_1.CardManager.getInstance();
                const placeholder = cardManager.getCardByName('Pikachu');
                if (placeholder) {
                    for (let i = 0; i < diff; i++) {
                        const card = cardManager.getCardByName('Pikachu');
                        if (card) {
                            player.hand.cards.push(card);
                        }
                    }
                }
            }
            else if (diff < 0) {
                // Remove cards from hand
                for (let i = 0; i < Math.abs(diff) && player.hand.cards.length > 0; i++) {
                    player.hand.cards.pop();
                }
            }
        }
        // Modify deck size
        if (mods.deckSize !== undefined) {
            const diff = mods.deckSize - player.deck.cards.length;
            if (diff > 0) {
                const cardManager = card_manager_1.CardManager.getInstance();
                const placeholder = cardManager.getCardByName('Pikachu');
                if (placeholder) {
                    for (let i = 0; i < diff; i++) {
                        const card = cardManager.getCardByName('Pikachu');
                        if (card) {
                            player.deck.cards.push(card);
                        }
                    }
                }
            }
            else if (diff < 0) {
                for (let i = 0; i < Math.abs(diff) && player.deck.cards.length > 0; i++) {
                    player.deck.cards.pop();
                }
            }
        }
        // Modify discard size
        if (mods.discardSize !== undefined) {
            const diff = mods.discardSize - player.discard.cards.length;
            if (diff > 0) {
                const cardManager = card_manager_1.CardManager.getInstance();
                const placeholder = cardManager.getCardByName('Pikachu');
                if (placeholder) {
                    for (let i = 0; i < diff; i++) {
                        const card = cardManager.getCardByName('Pikachu');
                        if (card) {
                            player.discard.cards.push(card);
                        }
                    }
                }
            }
            else if (diff < 0) {
                for (let i = 0; i < Math.abs(diff) && player.discard.cards.length > 0; i++) {
                    player.discard.cards.pop();
                }
            }
        }
        // Modify lostzone size
        if (mods.lostzoneSize !== undefined) {
            const diff = mods.lostzoneSize - player.lostzone.cards.length;
            if (diff > 0) {
                const cardManager = card_manager_1.CardManager.getInstance();
                const placeholder = cardManager.getCardByName('Pikachu');
                if (placeholder) {
                    for (let i = 0; i < diff; i++) {
                        const card = cardManager.getCardByName('Pikachu');
                        if (card) {
                            player.lostzone.cards.push(card);
                        }
                    }
                }
            }
            else if (diff < 0) {
                for (let i = 0; i < Math.abs(diff) && player.lostzone.cards.length > 0; i++) {
                    player.lostzone.cards.pop();
                }
            }
        }
        // Modify turn counters
        if (mods.supporterTurn !== undefined)
            player.supporterTurn = mods.supporterTurn;
        if (mods.retreatedTurn !== undefined)
            player.retreatedTurn = mods.retreatedTurn;
        if (mods.energyPlayedTurn !== undefined)
            player.energyPlayedTurn = mods.energyPlayedTurn;
        if (mods.stadiumPlayedTurn !== undefined)
            player.stadiumPlayedTurn = mods.stadiumPlayedTurn;
        if (mods.stadiumUsedTurn !== undefined)
            player.stadiumUsedTurn = mods.stadiumUsedTurn;
        if (mods.usedVSTAR !== undefined)
            player.usedVSTAR = mods.usedVSTAR;
        if (mods.usedGX !== undefined)
            player.usedGX = mods.usedGX;
        if (mods.ancientSupporter !== undefined)
            player.ancientSupporter = mods.ancientSupporter;
        if (mods.rocketSupporter !== undefined)
            player.rocketSupporter = mods.rocketSupporter;
        return state;
    }
    if (action instanceof sandbox_modify_game_state_action_1.SandboxModifyGameStateAction) {
        const mods = action.modifications;
        if (mods.turn !== undefined)
            state.turn = mods.turn;
        if (mods.phase !== undefined)
            state.phase = mods.phase;
        if (mods.activePlayer !== undefined && mods.activePlayer >= 0 && mods.activePlayer < state.players.length) {
            state.activePlayer = mods.activePlayer;
        }
        if (mods.skipOpponentTurn !== undefined)
            state.skipOpponentTurn = mods.skipOpponentTurn;
        if (mods.isSuddenDeath !== undefined)
            state.isSuddenDeath = mods.isSuddenDeath;
        if (mods.rules !== undefined) {
            Object.assign(state.rules, mods.rules);
        }
        return state;
    }
    if (action instanceof sandbox_modify_card_action_1.SandboxModifyCardAction) {
        const player = state.players.find(p => p.id === action.targetPlayerId);
        if (!player) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ILLEGAL_ACTION);
        }
        const cardManager = card_manager_1.CardManager.getInstance();
        let card = cardManager.getCardByName(action.cardName);
        if (!card) {
            throw new game_error_1.GameError(game_message_1.GameMessage.UNKNOWN_CARD, action.cardName);
        }
        if (action.action === 'add') {
            const targetZone = getZone(player, action.toZone || sandbox_modify_card_action_1.CardZone.HAND);
            if (targetZone) {
                // Clone the card
                card = cardManager.getCardByName(action.cardName);
                if (card) {
                    if (action.toZone === sandbox_modify_card_action_1.CardZone.PRIZES && action.prizeIndex !== undefined) {
                        if (player.prizes[action.prizeIndex]) {
                            player.prizes[action.prizeIndex].cards.push(card);
                        }
                    }
                    else {
                        targetZone.cards.push(card);
                    }
                }
            }
        }
        else if (action.action === 'remove') {
            const sourceZone = getZone(player, action.fromZone || sandbox_modify_card_action_1.CardZone.HAND);
            if (sourceZone) {
                if (action.fromZone === sandbox_modify_card_action_1.CardZone.PRIZES && action.fromIndex !== undefined) {
                    if (player.prizes[action.fromIndex] && player.prizes[action.fromIndex].cards.length > 0) {
                        player.prizes[action.fromIndex].cards.pop();
                    }
                }
                else {
                    const index = sourceZone.cards.findIndex(c => c.fullName === action.cardName);
                    if (index !== -1) {
                        sourceZone.cards.splice(index, 1);
                    }
                }
            }
        }
        else if (action.action === 'move') {
            const sourceZone = getZone(player, action.fromZone || sandbox_modify_card_action_1.CardZone.HAND);
            const targetZone = getZone(player, action.toZone || sandbox_modify_card_action_1.CardZone.HAND);
            if (sourceZone && targetZone) {
                const index = action.fromIndex !== undefined ? action.fromIndex :
                    sourceZone.cards.findIndex(c => c.fullName === action.cardName);
                if (index !== -1 && index < sourceZone.cards.length) {
                    const cardToMove = sourceZone.cards.splice(index, 1)[0];
                    if (action.toZone === sandbox_modify_card_action_1.CardZone.PRIZES && action.prizeIndex !== undefined) {
                        if (player.prizes[action.prizeIndex]) {
                            player.prizes[action.prizeIndex].cards.push(cardToMove);
                        }
                    }
                    else {
                        targetZone.cards.push(cardToMove);
                    }
                }
            }
        }
        return state;
    }
    if (action instanceof sandbox_modify_pokemon_action_1.SandboxModifyPokemonAction) {
        const player = state.players.find(p => p.id === action.targetPlayerId);
        if (!player) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ILLEGAL_ACTION);
        }
        let pokemon;
        if (action.location === 'active') {
            pokemon = player.active;
        }
        else if (action.location === 'bench' && action.benchIndex !== undefined) {
            pokemon = player.bench[action.benchIndex];
        }
        if (!pokemon) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ILLEGAL_ACTION);
        }
        const mods = action.modifications;
        // Modify damage (on PokemonCardList, not PokemonCard)
        if (mods.damage !== undefined) {
            pokemon.damage = Math.max(0, mods.damage);
        }
        // Modify HP (on PokemonCardList)
        if (mods.hp !== undefined) {
            pokemon.hp = Math.max(1, mods.hp);
        }
        // Modify energy
        if (mods.energyCount !== undefined) {
            const currentEnergy = pokemon.energies.cards.length;
            const diff = mods.energyCount - currentEnergy;
            if (diff > 0) {
                // Add energy
                const cardManager = card_manager_1.CardManager.getInstance();
                // Use specified energy type if provided, otherwise default to Fire Energy
                const energyName = mods.energyTypes && mods.energyTypes.length > 0
                    ? mods.energyTypes[0]
                    : 'Fire Energy SVE 2';
                for (let i = 0; i < diff; i++) {
                    const energy = cardManager.getCardByName(energyName);
                    if (energy) {
                        pokemon.energies.cards.push(energy);
                    }
                    else {
                        // Fallback to Fire Energy if specified energy not found
                        const fallbackEnergy = cardManager.getCardByName('Fire Energy SVE 2');
                        if (fallbackEnergy) {
                            pokemon.energies.cards.push(fallbackEnergy);
                        }
                    }
                }
            }
            else if (diff < 0) {
                // Remove energy
                for (let i = 0; i < Math.abs(diff) && pokemon.energies.cards.length > 0; i++) {
                    pokemon.energies.cards.pop();
                }
            }
        }
        // Modify conditions
        if (mods.conditions) {
            if (mods.conditions.burned !== undefined) {
                if (mods.conditions.burned) {
                    pokemon.addSpecialCondition(card_types_1.SpecialCondition.BURNED);
                }
                else {
                    pokemon.removeSpecialCondition(card_types_1.SpecialCondition.BURNED);
                }
            }
            if (mods.conditions.poisoned !== undefined) {
                if (mods.conditions.poisoned) {
                    pokemon.addSpecialCondition(card_types_1.SpecialCondition.POISONED);
                }
                else {
                    pokemon.removeSpecialCondition(card_types_1.SpecialCondition.POISONED);
                }
            }
            if (mods.conditions.asleep !== undefined) {
                if (mods.conditions.asleep) {
                    pokemon.addSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
                }
                else {
                    pokemon.removeSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
                }
            }
            if (mods.conditions.paralyzed !== undefined) {
                if (mods.conditions.paralyzed) {
                    pokemon.addSpecialCondition(card_types_1.SpecialCondition.PARALYZED);
                }
                else {
                    pokemon.removeSpecialCondition(card_types_1.SpecialCondition.PARALYZED);
                }
            }
            if (mods.conditions.confused !== undefined) {
                if (mods.conditions.confused) {
                    pokemon.addSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
                }
                else {
                    pokemon.removeSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
                }
            }
        }
        // Modify markers (use addMarkerToState for state-level markers)
        if (mods.markers) {
            for (const [marker, value] of Object.entries(mods.markers)) {
                if (value) {
                    player.marker.addMarkerToState(marker);
                }
                else {
                    player.marker.removeMarker(marker);
                }
            }
        }
        return state;
    }
    return state;
}
exports.sandboxReducer = sandboxReducer;
function getZone(player, zone) {
    switch (zone) {
        case sandbox_modify_card_action_1.CardZone.HAND:
            return player.hand;
        case sandbox_modify_card_action_1.CardZone.DECK:
            return player.deck;
        case sandbox_modify_card_action_1.CardZone.DISCARD:
            return player.discard;
        case sandbox_modify_card_action_1.CardZone.LOSTZONE:
            return player.lostzone;
        case sandbox_modify_card_action_1.CardZone.STADIUM:
            return player.stadium;
        case sandbox_modify_card_action_1.CardZone.SUPPORTER:
            return player.supporter;
        default:
            return undefined;
    }
}
