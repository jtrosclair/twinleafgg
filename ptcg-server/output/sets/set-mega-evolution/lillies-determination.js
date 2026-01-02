"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LilliesDetermination = void 0;
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const game_1 = require("../../game");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    // Do not play if supporter has been played
    if (player.supporterTurn > 0) {
        throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    // Move hand to deck
    const cards = player.hand.cards.filter(c => c !== self);
    player.hand.moveCardsTo(cards, player.deck);
    yield store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
        next();
    });
    // Draw cards
    const cardsToDraw = player.getPrizeLeft() === 6 ? 8 : 6;
    player.deck.moveTo(player.hand, cardsToDraw);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return state;
}
class LilliesDetermination extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'MEG';
        this.regulationMark = 'I';
        this.setNumber = '119';
        this.name = 'Lillie\'s Determination';
        this.cardImage = 'assets/cardback.png';
        this.fullName = 'Lillie\'s Determination M1L';
        this.text = 'Shuffle your hand into your deck. Then, draw 6 cards. If you have exactly 6 Prize cards remaining, draw 8 cards instead.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.LilliesDetermination = LilliesDetermination;
