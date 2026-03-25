"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AaronsCollection = void 0;
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    let cards = [];
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    if (player.deck.cards.length === 0) {
        throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    // Count SPMons and basicEnergy separately
    let SPMons = 0;
    let basicEnergy = 0;
    const blocked = [];
    player.deck.cards.forEach((c, index) => {
        if (c instanceof game_1.PokemonCard && c.tags.includes(card_types_1.CardTag.POKEMON_SP)) {
            SPMons += 1;
        }
        else if (c.superType === card_types_1.SuperType.ENERGY && c.energyType === card_types_1.EnergyType.BASIC) {
            basicEnergy += 1;
        }
        else {
            blocked.push(index);
        }
    });
    // Limit max for each type to 1
    const maxPokemons = Math.min(SPMons, 1);
    const maxBasicEnergies = Math.min(basicEnergy, 1);
    // Total max is sum of max for each 
    const count = maxPokemons + maxBasicEnergies;
    // Pass max counts to prompt options
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARDS, player.deck, {}, { min: 0, max: count, allowCancel: false, blocked, maxPokemons, maxBasicEnergies }), selected => {
        cards = selected || [];
        next();
    });
    (0, prefabs_1.MOVE_CARDS)(store, state, player.deck, player.hand, { cards, sourceCard: effect.trainerCard });
    cards.forEach((card, index) => {
        store.log(state, game_message_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
    });
    (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, cards);
    (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
}
class AaronsCollection extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'RR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '88';
        this.name = 'Aaron\'s Collection';
        this.fullName = 'Aaron\'s Collection RR';
        this.text = 'Search your discard pile for up to 2 in any combination of Pokémon SP and basic Energy cards, show them to your opponent, and put them into your hand.';
    }
    canPlay(store, state, player) {
        // Check if supporter already played this turn
        if (player.supporterTurn > 0) {
            return false;
        }
        if (player.deck.cards.length === 0) {
            return false;
        }
        // No other restrictions - card can be played
        return true;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.AaronsCollection = AaronsCollection;
