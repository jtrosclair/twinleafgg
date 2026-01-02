"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrimsleysGambit = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class GrimsleysGambit extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.SUPPORTER;
        this.set = 'PFL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '90';
        this.regulationMark = 'I';
        this.name = 'Grimsley\'s Move';
        this.fullName = 'Grimsley\'s Gambit M2';
        this.text = 'Look at the top 7 cards of your deck and put a [D] Pokémon you find there onto your Bench. Shuffle the other cards and put them on the bottom of your deck. You can\'t use this card on your first turn.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Check if bench has open slots
            const openSlots = player.bench.filter(b => b.cards.length === 0);
            if (openSlots.length === 0) {
                // No open slots, throw error
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            if (state.turn === 1 || state.turn === 2) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const deckTop = new game_1.CardList();
            state = prefabs_1.MOVE_CARDS(store, state, player.deck, deckTop, { count: 7 });
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, deckTop, { superType: game_1.SuperType.POKEMON, cardType: game_1.CardType.DARK }, { min: 0, max: 1, allowCancel: false }), selectedCards => {
                cards = selectedCards || [];
                cards.forEach((card, index) => {
                    state = prefabs_1.MOVE_CARDS(store, state, deckTop, openSlots[index], { cards: [card] });
                    openSlots[index].pokemonPlayedTurn = state.turn;
                });
                state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    deckTop.applyOrder(order);
                });
                state = prefabs_1.MOVE_CARDS(store, state, deckTop, player.deck, { toBottom: true });
                state = prefabs_1.MOVE_CARDS(store, state, player.supporter, player.discard, { cards: [effect.trainerCard] });
                return state;
            });
        }
        return state;
    }
}
exports.GrimsleysGambit = GrimsleysGambit;
