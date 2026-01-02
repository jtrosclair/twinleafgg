"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skyla = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* playCard(next, store, state, effect, self) {
    const player = effect.player;
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    if (player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, self, { superType: card_types_1.SuperType.TRAINER }, { min: 0, max: 1, allowCancel: false });
    prefabs_1.CLEAN_UP_SUPPORTER(effect, player);
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Skyla extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'BCR';
        this.name = 'Skyla';
        this.fullName = 'Skyla BCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '134';
        this.text = 'Search your deck for a Trainer card, reveal it, and put it ' +
            'into your hand. Shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect, this);
            return generator.next().value;
        }
        return state;
    }
}
exports.Skyla = Skyla;
