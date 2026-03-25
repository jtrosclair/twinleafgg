"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuzzleOfTime = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class PuzzleOfTime extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'BKP';
        this.name = 'Puzzle of Time';
        this.fullName = 'Puzzle of Time BKP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '109';
        this.text = 'You may play 2 Puzzle of Time cards at once.\n\n' +
            '• If you played 1 card, look at the top 3 cards of your deck and put them back in any order.\n' +
            '• If you played 2 cards, put 2 cards from your discard pile into your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            if (player.deck.cards.length === 0 && player.hand.cards.filter(c => c.name === 'Puzzle of Time').length < 2) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            state = store.prompt(state, new game_1.SelectOptionPrompt(player.id, game_1.GameMessage.CHOOSE_OPTION, [
                'play 1 card, look at the top 3 cards of your deck and put them back in any order.',
                'play 2 cards, put 2 cards from your discard pile into your hand.'
            ], {
                allowCancel: false,
                defaultValue: 0
            }), choice => {
                if (choice === 0) {
                    if (player.deck.cards.length === 0) {
                        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                    }
                    const deckTop = new game_1.CardList();
                    player.deck.moveTo(deckTop, 3);
                    return store.prompt(state, new game_1.OrderCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARDS_ORDER, deckTop, { allowCancel: false }), order => {
                        if (order === null) {
                            return state;
                        }
                        deckTop.applyOrder(order);
                        deckTop.moveToTopOfDestination(player.deck);
                    });
                }
                else if (choice === 1) {
                    if (player.discard.cards.length === 0) {
                        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                    }
                    if (player.hand.cards.filter(c => c.name === 'Puzzle of Time').length === 0) {
                        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                    }
                    const secondPuzzle = player.hand.cards.find(c => c.name === 'Puzzle of Time');
                    const mincards = Math.min(player.discard.cards.length, 2);
                    (0, prefabs_1.SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND)(store, state, player, this, {}, { min: mincards, max: mincards, allowCancel: false }, effect);
                    if (secondPuzzle) {
                        (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.discard, { cards: [secondPuzzle], sourceCard: this });
                    }
                }
            });
        }
        return state;
    }
}
exports.PuzzleOfTime = PuzzleOfTime;
