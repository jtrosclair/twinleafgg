"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MistysWrath = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
class MistysWrath extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'G1';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '114';
        this.name = 'Misty\'s Wrath';
        this.fullName = 'Misty\'s Wrath G1';
        this.text = 'Look at the top 7 cards of your deck. Choose 2 of those cards and put them into your hand. Discard the rest.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            const deckTop = new game_1.CardList();
            player.deck.moveTo(deckTop, 7);
            const min = player.deck.cards.length > 1 ? Math.min(2, deckTop.cards.length) : 1;
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, deckTop, {}, { min, max: 2, allowCancel: false }), selected => {
                player.ancientSupporter = true;
                deckTop.moveCardsTo(selected, player.hand);
                deckTop.moveTo(player.discard);
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
            });
        }
        return state;
    }
}
exports.MistysWrath = MistysWrath;
