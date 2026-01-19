"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImposterOaksRevenge = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class ImposterOaksRevenge extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'TR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '76';
        this.name = 'Imposter Oak\'s Revenge';
        this.fullName = 'Imposter Oak\'s Revenge TR';
        this.text = 'Discard a card from your hand in order to play this card. Your opponent shuffles his or her hand into his or her deck, then draws 4 cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            (0, trainer_prefabs_1.DISCARD_X_CARDS_FROM_YOUR_HAND)(effect, store, state, 1, 1);
            (0, prefabs_1.MOVE_CARDS)(store, state, opponent.hand, opponent.deck);
            (0, prefabs_1.SHUFFLE_DECK)(store, state, opponent);
            (0, prefabs_1.DRAW_CARDS)(opponent, 4);
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            return state;
        }
        return state;
    }
}
exports.ImposterOaksRevenge = ImposterOaksRevenge;
