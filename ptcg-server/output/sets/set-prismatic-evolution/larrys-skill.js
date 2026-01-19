"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LarrysSkill = void 0;
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
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
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.discard, { sourceCard: effect.trainerCard });
    // Count tools and items separately
    let pokemons = 0;
    let supporters = 0;
    let energies = 0;
    const blocked = [];
    player.deck.cards.forEach((c, index) => {
        if (c instanceof game_1.PokemonCard) {
            pokemons += 1;
        }
        else if (c instanceof trainer_card_1.TrainerCard && c.trainerType === card_types_1.TrainerType.SUPPORTER) {
            supporters += 1;
        }
        else if (c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC) {
            energies += 1;
        }
        else {
            blocked.push(index);
        }
    });
    // Limit max for each type to 1
    const maxPokemons = Math.min(pokemons, 1);
    const maxSupporters = Math.min(supporters, 1);
    const maxEnergies = Math.min(energies, 1);
    // Total max is sum of max for each 
    const count = maxPokemons + maxSupporters + maxEnergies;
    // Pass max counts to prompt options
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARDS, player.deck, {}, { min: 0, max: count, allowCancel: false, blocked, maxPokemons, maxSupporters, maxEnergies }), selected => {
        cards = selected || [];
        next();
    });
    player.deck.moveCardsTo(cards, player.hand);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    cards.forEach((card, index) => {
        store.log(state, game_message_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
    });
    if (cards.length > 0) {
        yield store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class LarrysSkill extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'H';
        this.set = 'PRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '115';
        this.name = 'Larry\'s Skill';
        this.fullName = 'Larry\'s Skill PRE';
        this.text = 'Discard your hand and search your deck for a Pokémon, a Supporter card, and a Basic Energy card, reveal them, and put them into your hand. Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.LarrysSkill = LarrysSkill;
