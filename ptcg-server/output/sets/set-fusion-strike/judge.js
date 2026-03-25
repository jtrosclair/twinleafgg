"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Judge = void 0;
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Judge extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'FST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '235';
        this.regulationMark = 'E';
        this.name = 'Judge';
        this.fullName = 'Judge FST';
        this.text = 'Each player shuffles their hand into their deck and draws 4 cards.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            const cards = player.hand.cards.filter(c => c !== this);
            if (cards.length === 0 && player.deck.cards.length === 0) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const playerMoveEffect = new game_effects_1.MoveCardsEffect(player.hand, player.deck, { cards, sourceCard: this });
            state = store.reduceEffect(state, playerMoveEffect);
            const opponentMoveEffect = new game_effects_1.MoveCardsEffect(opponent.hand, opponent.deck, { sourceCard: this });
            state = store.reduceEffect(state, opponentMoveEffect);
            // opponent shuffle and draw
            if (!opponentMoveEffect.preventDefault) {
                (0, prefabs_1.SHUFFLE_DECK)(store, state, opponent);
                (0, prefabs_1.DRAW_CARDS)(opponent, 4);
            }
            // player shuffle and draw
            (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            (0, prefabs_1.DRAW_CARDS)(player, 4);
        }
        return state;
    }
}
exports.Judge = Judge;
