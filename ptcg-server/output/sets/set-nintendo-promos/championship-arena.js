"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChampionshipArena = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ChampionshipArena extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'NP';
        this.name = 'Championship Arena';
        this.fullName = 'Championship Arena NP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '28';
        this.text = 'At the end of each player\'s turn, if that player has 8 or more cards in his or her hand, that player discards a number of cards until the player has 7 cards left in his or her hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            if (player.hand.cards.length >= 8) {
                const discardAmount = player.hand.cards.length - 7;
                state = store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(effect.player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: false, min: discardAmount, max: discardAmount }), cards => {
                    cards = cards || [];
                    if (cards.length === 0) {
                        return;
                    }
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.discard, { cards: cards, sourceCard: this });
                    cards.forEach((card, index) => {
                        store.log(state, game_message_1.GameLog.LOG_PLAYER_DISCARDS_CARD_FROM_HAND, { name: player.name, card: card.name });
                    });
                });
            }
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.ChampionshipArena = ChampionshipArena;
