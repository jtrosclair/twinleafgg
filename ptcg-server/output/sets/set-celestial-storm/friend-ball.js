"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendBall = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    let cards = [];
    if (player.deck.cards.length === 0) {
        throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // Get all types of opponent's Pokemon in play
    const opponentTypes = new Set();
    // Check active Pokemon
    if (opponent.active.cards.length > 0 && opponent.active.cards[0] instanceof game_1.PokemonCard) {
        const activePokemon = opponent.active.cards[0];
        opponentTypes.add(activePokemon.cardType);
        if (activePokemon.additionalCardTypes) {
            activePokemon.additionalCardTypes.forEach(type => opponentTypes.add(type));
        }
    }
    // Check bench Pokemon
    opponent.bench.forEach(benchSlot => {
        if (benchSlot.cards.length > 0 && benchSlot.cards[0] instanceof game_1.PokemonCard) {
            const benchPokemon = benchSlot.cards[0];
            opponentTypes.add(benchPokemon.cardType);
            if (benchPokemon.additionalCardTypes) {
                benchPokemon.additionalCardTypes.forEach(type => opponentTypes.add(type));
            }
        }
    });
    // Block cards that don't share any type with opponent's Pokemon
    const blocked = [];
    player.deck.cards.forEach((card, index) => {
        if (card instanceof game_1.PokemonCard) {
            const cardTypes = [card.cardType];
            if (card.additionalCardTypes) {
                cardTypes.push(...card.additionalCardTypes);
            }
            const hasMatchingType = cardTypes.some(type => opponentTypes.has(type));
            if (!hasMatchingType) {
                blocked.push(index);
            }
        }
        else {
            blocked.push(index);
        }
    });
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: true, blocked: blocked }), selected => {
        cards = selected || [];
        next();
    });
    player.deck.moveCardsTo(cards, player.hand);
    if (cards.length > 0) {
        yield store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class FriendBall extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'CES';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '131';
        this.name = 'Friend Ball';
        this.fullName = 'Friend Ball CES';
        this.text = 'Search your deck for a Pokémon with the same type as 1 of your opponent\'s Pokémon in play, reveal it, and put it into your hand. Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.FriendBall = FriendBall;
