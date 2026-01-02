"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lass = void 0;
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lass extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'BS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '75';
        this.name = 'Lass';
        this.fullName = 'Lass BS';
        this.text = 'You and your opponent show each other your hands, then shuffle all the Trainer cards from your hands into your decks.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Exclude Lass itself from hand checks (if needed)
            const playerHandWithoutLass = player.hand.cards.filter(c => c !== this);
            const opponentHand = opponent.hand.cards;
            // If both hands are empty, do nothing
            if (playerHandWithoutLass.length === 0 && opponentHand.length === 0) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Helper to move all Trainer cards from hand to deck using MOVE_CARDS
            const moveTrainersToDeck = (store, state, hand, deck) => {
                const trainers = hand.cards.filter((c) => c.superType === card_types_1.SuperType.TRAINER);
                if (trainers.length > 0) {
                    state = prefabs_1.MOVE_CARDS(store, state, hand, deck, { cards: trainers, sourceCard: this });
                }
                return state;
            };
            // Show both hands (if not empty), then shuffle trainers, then shuffle decks
            return store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, player.hand.cards), () => {
                return store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, opponent.hand.cards), () => {
                    // Move Trainer cards from both hands to decks
                    state = moveTrainersToDeck(store, state, player.hand, player.deck);
                    state = moveTrainersToDeck(store, state, opponent.hand, opponent.deck);
                    // Discard Lass (if needed)
                    if (player.hand.cards.includes(effect.trainerCard)) {
                        state = prefabs_1.MOVE_CARDS(store, state, player.hand, player.discard, { cards: [effect.trainerCard], sourceCard: this });
                    }
                    // Shuffle both decks
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), playerOrder => {
                        player.deck.applyOrder(playerOrder);
                        return store.prompt(state, new game_1.ShuffleDeckPrompt(opponent.id), opponentOrder => {
                            opponent.deck.applyOrder(opponentOrder);
                            prefabs_1.CLEAN_UP_SUPPORTER(effect, player);
                            return state;
                        });
                    });
                });
            });
        }
        return state;
    }
}
exports.Lass = Lass;
