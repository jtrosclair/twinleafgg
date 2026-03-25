"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnergyCharge = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    let energyInDiscard = 0;
    const blocked = [];
    player.discard.cards.forEach((c, index) => {
        const isEnergy = c.superType === card_types_1.SuperType.ENERGY;
        if (isEnergy) {
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
    let coinResult = false;
    yield store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP), result => {
        coinResult = result;
        next();
    });
    if (!coinResult) {
        return state;
    }
    const number = Math.min(2, energyInDiscard);
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, { superType: card_types_1.SuperType.ENERGY }, { min: number, max: number, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    (0, prefabs_1.MOVE_CARDS)(store, state, player.discard, player.deck, { cards, sourceCard: self });
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class EnergyCharge extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'DX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '86';
        this.name = 'Energy Charge';
        this.fullName = 'Energy Charge DX';
        this.text = 'Flip a coin. If heads, search your discard pile for 2 Energy cards (1 if there is only 1), show them to your opponent, and shuffle them into your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.EnergyCharge = EnergyCharge;
