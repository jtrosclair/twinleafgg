"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismTower = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
class PrismTower extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'M4';
        this.setNumber = '80';
        this.usSetNumber = 'CRI 80';
        this.name = 'Prism Tower';
        this.fullName = 'Prism Tower M4';
        this.cardImage = 'assets/cardback.png';
        this.text = 'Once during each player\'s turn, that player may discard 2 cards from their hand. If they do, they draw a card.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const stadiumUsedTurn = player.stadiumUsedTurn;
            if (player.stadiumUsedTurn === state.turn) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
            }
            if (player.hand.cards.length < 2) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
            }
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: true, min: 2, max: 2 }), selected => {
                selected = selected || [];
                if (selected.length === 0) {
                    player.stadiumUsedTurn = stadiumUsedTurn;
                    return;
                }
                player.hand.moveCardsTo(selected, player.discard);
                player.deck.moveTo(player.hand, 1);
            });
        }
        return state;
    }
}
exports.PrismTower = PrismTower;
