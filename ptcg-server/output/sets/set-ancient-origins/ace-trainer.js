"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AceTrainer = void 0;
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class AceTrainer extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'AOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '69';
        this.name = 'Ace Trainer';
        this.fullName = 'Ace Trainer AOR';
        this.text = 'You can play this card only if you have more Prize cards left than your opponent.\n\nEach player shuffles his or her hand into his or her deck. Then, draw 6 cards. Your opponent draws 3 cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            if (player.getPrizeLeft() <= opponent.getPrizeLeft()) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const cards = player.hand.cards.filter(c => c !== this);
            (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.deck, { cards, sourceCard: this });
            (0, prefabs_1.MOVE_CARDS)(store, state, opponent.hand, opponent.deck, { sourceCard: this });
            store.prompt(state, [
                new shuffle_prompt_1.ShuffleDeckPrompt(player.id),
                new shuffle_prompt_1.ShuffleDeckPrompt(opponent.id)
            ], deckOrder => {
                player.deck.applyOrder(deckOrder[0]);
                opponent.deck.applyOrder(deckOrder[1]);
                (0, prefabs_1.DRAW_CARDS)(player, 6);
                (0, prefabs_1.DRAW_CARDS)(opponent, 3);
                (0, prefabs_1.CLEAN_UP_SUPPORTER)(effect, player);
            });
        }
        return state;
    }
}
exports.AceTrainer = AceTrainer;
