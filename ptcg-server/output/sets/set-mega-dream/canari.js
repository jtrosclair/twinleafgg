"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Canari = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const card_list_1 = require("../../game/store/state/card-list");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const state_utils_1 = require("../../game/store/state-utils");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    // Check if player has at least 1 other card in hand (excluding Canari)
    const otherCards = player.hand.cards.filter(c => c !== self);
    if (otherCards.length < 1) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // Prepare card list without Canari for discard prompt
    const handTemp = new card_list_1.CardList();
    handTemp.cards = player.hand.cards.filter(c => c !== self);
    let discardCards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, handTemp, {}, { min: 1, max: 1, allowCancel: false }), selected => {
        discardCards = selected || [];
        next();
    });
    // Operation canceled by the user
    if (discardCards.length === 0) {
        return state;
    }
    prefabs_1.MOVE_CARDS(store, state, player.hand, player.discard, { cards: discardCards, sourceCard: self });
    // Build blocked indices array for non-Lightning Pokemon
    let lightningPokemonCount = 0;
    const blocked = [];
    player.deck.cards.forEach((card, index) => {
        if (card instanceof pokemon_card_1.PokemonCard && card.cardType === card_types_1.CardType.LIGHTNING) {
            lightningPokemonCount += 1;
        }
        else {
            blocked.push(index);
        }
    });
    // Search deck for up to 4 Lightning Pokemon
    let cards = [];
    const maxCards = Math.min(lightningPokemonCount, 4);
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 0, max: maxCards, allowCancel: false, blocked }), selected => {
        cards = selected || [];
        next();
    });
    player.deck.moveCardsTo(cards, player.hand);
    if (cards.length > 0) {
        yield store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    prefabs_1.CLEAN_UP_SUPPORTER(effect, player);
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Canari extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'I';
        this.set = 'M2a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '170';
        this.name = 'Canari';
        this.fullName = 'Canari M2a';
        this.text = `You must discard 1 other card from your hand to play this card.
  
  Search your deck for up to 4 [L] Pokémon and put them into your hand. Then, shuffle your deck.`;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Canari = Canari;
