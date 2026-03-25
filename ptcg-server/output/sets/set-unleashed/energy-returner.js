"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnergyReturner = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const state_utils_1 = require("../../game/store/state-utils");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    let energyInDiscard = 0;
    const blocked = [];
    player.discard.cards.forEach((c, index) => {
        const isBasicEnergy = c.superType === card_types_1.SuperType.ENERGY && c.energyType === card_types_1.EnergyType.BASIC;
        if (isBasicEnergy) {
            energyInDiscard += 1;
        }
        else {
            blocked.push(index);
        }
    });
    // Player does not have correct cards in discard
    if (energyInDiscard === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    const min = Math.min(energyInDiscard, 4);
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min, max: 4, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, cards);
    (0, prefabs_1.MOVE_CARDS)(store, state, player.discard, player.deck, { cards, sourceCard: self });
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class EnergyReturner extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'UL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '74';
        this.name = 'Energy Returner';
        this.fullName = 'Energy Returner UL';
        this.text = 'Search your discard pile for 4 basic Energy cards, show them to your opponent, and shuffle them into your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.EnergyReturner = EnergyReturner;
