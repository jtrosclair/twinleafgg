"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigCatchNet = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const energy_card_1 = require("../../game/store/card/energy-card");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const card_types_2 = require("../../game/store/card/card-types");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const blocked = [];
    player.discard.cards.forEach((c, index) => {
        const isWaterPokemon = c instanceof pokemon_card_1.PokemonCard && c.cardType === card_types_2.CardType.WATER;
        const isBasicWaterEnergy = c instanceof energy_card_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.provides.includes(card_types_2.CardType.WATER);
        if (!isWaterPokemon && !isBasicWaterEnergy) {
            blocked.push(index);
        }
    });
    const eligibleCount = player.discard.cards.length - blocked.length;
    if (eligibleCount === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    effect.preventDefault = true;
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, {}, { min: 0, max: 6, allowCancel: false, blocked, maxPokemons: 3, maxBasicEnergies: 3 }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length > 0) {
        cards.forEach(card => {
            store.log(state, game_message_1.GameLog.LOG_PLAYER_RETURNS_TO_DECK_FROM_DISCARD, { name: player.name, card: card.name });
        });
        player.discard.moveCardsTo(cards, player.deck);
    }
    const cardList = state_utils_1.StateUtils.findCardList(state, effect.trainerCard);
    if (cardList)
        cardList.moveCardTo(effect.trainerCard, player.discard);
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class BigCatchNet extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'M4';
        this.regulationMark = 'J';
        this.name = 'Big Catch Net';
        this.fullName = 'Big Catch Net M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '73';
        this.text = 'Shuffle up to 3 [W] Pokemon and up to 3 Basic [W] Energy from your discard pile into your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.BigCatchNet = BigCatchNet;
