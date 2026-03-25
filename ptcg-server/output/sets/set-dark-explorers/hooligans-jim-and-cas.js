"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HooligansJimAndCas = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
class HooligansJimAndCas extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'DEX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '95';
        this.name = 'Hooligans Jim & Cas';
        this.fullName = 'Hooligans Jim & Cas DEX';
        this.text = 'Flip a coin. If heads, choose 3 random cards from your opponent\'s hand. ' +
            'Your opponent reveals those cards and shuffles them into his or her deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result && opponent.hand.cards.length > 0) {
                    // Select up to 3 random cards from opponent's hand
                    const cardsToShuffle = Math.min(3, opponent.hand.cards.length);
                    const selectedCards = [];
                    const handCopy = [...opponent.hand.cards];
                    for (let i = 0; i < cardsToShuffle; i++) {
                        const randomIndex = Math.floor(Math.random() * handCopy.length);
                        selectedCards.push(handCopy[randomIndex]);
                        handCopy.splice(randomIndex, 1);
                    }
                    // Show the selected cards to both players
                    return store.prompt(state, [
                        new show_cards_prompt_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_EFFECT, selectedCards),
                        new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, selectedCards)
                    ], () => {
                        // Shuffle the selected cards into opponent's deck
                        (0, prefabs_1.SHUFFLE_CARDS_INTO_DECK)(store, state, opponent, selectedCards);
                    });
                }
            });
        }
        return state;
    }
}
exports.HooligansJimAndCas = HooligansJimAndCas;
