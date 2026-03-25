"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BugCatcher = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
class BugCatcher extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'UNM';
        this.setNumber = '189';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Bug Catcher';
        this.fullName = 'Bug Catcher UNM';
        this.text = 'Draw 2 cards. Flip a coin. If heads, draw 2 more cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // Draw 2 cards
            player.deck.moveTo(player.hand, 2);
            // Flip a coin for 2 more
            state = store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_1.GameMessage.FLIP_COIN), result => {
                if (result) {
                    player.deck.moveTo(player.hand, 2);
                }
            });
            return state;
        }
        return state;
    }
}
exports.BugCatcher = BugCatcher;
