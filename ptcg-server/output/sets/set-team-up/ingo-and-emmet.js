"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngoAndEmmet = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
class IngoAndEmmet extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'TEU';
        this.name = 'Ingo & Emmet';
        this.fullName = 'Ingo & Emmet TEU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '144';
        this.text = 'Look at the top card of your deck, and then choose 1:\n' +
            '\n- Discard your hand and draw 5 cards.' +
            '\n- Discard your hand and draw 5 cards from the bottom of your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            (0, prefabs_1.MOVE_CARD_TO)(state, effect.trainerCard, player.supporter);
            if (player.deck.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const deckTop = new game_1.CardList();
            player.deck.moveTo(deckTop, 1);
            (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, player, deckTop.cards);
            deckTop.moveTo(player.deck, 0);
            player.deck.cards = deckTop.cards.concat(player.deck.cards);
            state = store.prompt(state, new game_1.SelectOptionPrompt(player.id, game_message_1.GameMessage.CHOOSE_OPTION, [
                'Discard your hand and draw 5 cards.',
                'Discard your hand and draw 5 cards from the bottom of your deck.'
            ], {
                allowCancel: false,
                defaultValue: 0
            }), choice => {
                if (choice === 0) {
                    // Option 1
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.discard);
                    (0, prefabs_1.DRAW_CARDS)(player, 5);
                }
                else if (choice === 1) {
                    // Option 2
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.discard);
                    const bottomCards = player.deck.cards.slice(-5);
                    player.deck.moveCardsTo(bottomCards, player.hand);
                }
            });
        }
        return state;
    }
}
exports.IngoAndEmmet = IngoAndEmmet;
