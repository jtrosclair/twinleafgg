"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TvReporter = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class TvReporter extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'DR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '88';
        this.name = 'TV Reporter';
        this.fullName = 'TV Reporter DR';
        this.text = 'Draw 3 cards. Then discard any 1 card from your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            prefabs_1.DRAW_CARDS(player, 3);
            trainer_prefabs_1.DISCARD_X_CARDS_FROM_YOUR_HAND(effect, store, state, 1, 1);
            prefabs_1.CLEAN_UP_SUPPORTER(effect, player);
        }
        return state;
    }
}
exports.TvReporter = TvReporter;
