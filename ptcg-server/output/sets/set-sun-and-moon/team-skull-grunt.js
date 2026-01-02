"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamSkullGrunt = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
class TeamSkullGrunt extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'SUM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '133';
        this.name = 'Team Skull Grunt';
        this.fullName = 'Team Skull Grunt SUM';
        this.text = 'Your opponent reveals their hand. Discard 2 Energy cards from it.';
    }
    reduceEffect(store, state, effect) {
        // Handle playing the card
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            if (opponent.hand.cards.length == 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: 2 }), selectedCard => {
                const selected = selectedCard || [];
                if (selectedCard === null || selected.length === 0) {
                    return;
                }
                opponent.hand.moveCardsTo(selected, opponent.discard);
                player.supporter.moveCardTo(this, player.discard);
            });
        }
        return state;
    }
}
exports.TeamSkullGrunt = TeamSkullGrunt;
