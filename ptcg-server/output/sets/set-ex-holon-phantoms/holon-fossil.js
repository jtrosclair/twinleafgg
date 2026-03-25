"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolonFossil = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class HolonFossil extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'HP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '86';
        this.name = 'Holon Fossil';
        this.fullName = 'Holon Fossil HP';
        this.text = 'Flip a coin. If heads, search your deck for an Omanyte, Kabuto, Aerodactyl, Aerodactyl ex, Lileep, or Anorith and put it onto your Bench. Shuffle your deck afterward. If tails, put an Omanyte, Kabuto, Aerodactyl, Aerodactyl ex, Lileep, or Anorith from your hand onto your Bench. Treat the new Benched Pokémon as a Basic Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            if (player.deck.cards.length === 0 && player.hand.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const slots = (0, prefabs_1.GET_PLAYER_BENCH_SLOTS)(player);
            (0, prefabs_1.BLOCK_IF_NO_SLOTS)(slots);
            const blockedDeck = [];
            player.deck.cards.forEach((card, index) => {
                if (card instanceof game_1.PokemonCard && (card.name === 'Omanyte' || card.name === 'Kabuto' || card.name === 'Aerodactyl' || card.name === 'Aerodactyl ex' || card.name === 'Lileep' || card.name === 'Anorith')) {
                    return;
                }
                else {
                    blockedDeck.push(index);
                }
            });
            const blockedHand = [];
            player.hand.cards.forEach((card, index) => {
                if (card instanceof game_1.PokemonCard && (card.name === 'Omanyte' || card.name === 'Kabuto' || card.name === 'Aerodactyl' || card.name === 'Aerodactyl ex' || card.name === 'Lileep' || card.name === 'Anorith')) {
                    return;
                }
                else {
                    blockedHand.push(index);
                }
            });
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            return store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP), flipResult => {
                if (flipResult) {
                    (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, player, {}, { min: 0, max: 1, blocked: blockedDeck });
                }
                else if (!flipResult) {
                    if (player.hand.cards.length === 0 || player.hand.cards.length === blockedHand.length) {
                        return state;
                    }
                    store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.hand, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: false, blocked: blockedHand }), selected => {
                        const cards = selected || [];
                        cards.forEach((card, index) => {
                            player.hand.moveCardTo(card, slots[index]);
                            slots[index].pokemonPlayedTurn = state.turn;
                        });
                    });
                }
                return state;
            });
        }
        return state;
    }
}
exports.HolonFossil = HolonFossil;
