"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AncientRuins = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class AncientRuins extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '119';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'SK';
        this.name = 'Ancient Ruins';
        this.fullName = 'Ancient Ruins SK';
        this.text = 'Once during each player\'s turn (before he or she attacks), if he or she has not played a Supporter card, that player may reveal his or her hand to his or her opponent. If that player reveals his or her hand and there is no Supporter card there, that player draws a card.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if (player.supporterTurn > 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
            }
            if (player.hand.cards.some(c => c instanceof trainer_card_1.TrainerCard && c.trainerType === card_types_1.TrainerType.SUPPORTER)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
            }
            (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, player.hand.cards);
            (0, prefabs_1.DRAW_CARDS)(player, 1);
        }
        return state;
    }
}
exports.AncientRuins = AncientRuins;
