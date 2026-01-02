"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WallysTraining = void 0;
const game_1 = require("../../game");
const card_manager_1 = require("../../game/cards/card-manager");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    // Look through all known cards to find out if Pokemon can evolve
    const cm = card_manager_1.CardManager.getInstance();
    const evolutions = cm.getAllCards().filter(c => {
        return c instanceof pokemon_card_1.PokemonCard && c.stage !== card_types_1.Stage.BASIC;
    });
    // Build possible evolution card names for player.active only
    const activeCard = player.active.getPokemonCard();
    const evolutionNames = [];
    if (activeCard) {
        evolutions.forEach(e => {
            if (e.evolvesFrom === activeCard.name && !evolutionNames.includes(e.name)) {
                evolutionNames.push(e.name);
            }
        });
    }
    // There is nothing that can evolve
    if (evolutionNames.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // Blocking pokemon cards, that cannot be valid evolutions
    const blocked = [];
    player.deck.cards.forEach((card, index) => {
        if (card instanceof pokemon_card_1.PokemonCard && !evolutionNames.includes(card.name)) {
            blocked.push(index);
        }
    });
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: true, blocked }), selected => {
        cards = selected || [];
        next();
    });
    // Canceled by user, he didn't found the card in the deck
    if (cards.length === 0) {
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return state;
    }
    const evolution = cards[0];
    // Only act on player.active, so no prompt for target
    const targetList = player.active;
    const pokemonCard = targetList.getPokemonCard();
    if (!pokemonCard || pokemonCard.name !== evolution.evolvesFrom) {
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return state; // invalid target
    }
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    // Evolve Pokemon
    player.deck.moveCardTo(evolution, targetList);
    targetList.clearEffects();
    targetList.pokemonPlayedTurn = state.turn;
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class WallysTraining extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'SS';
        this.name = 'Wally\'s Training';
        this.fullName = 'Wally\'s Training SS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '89';
        this.text = 'Search your deck for a card that evolves from your Active Pokémon (choose 1 if there are 2) and put it on your Active Pokémon. (This counts as evolving that Pokémon.) Shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.WallysTraining = WallysTraining;
