"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Challenge = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const prefabs_2 = require("../../game/store/prefabs/prefabs");
class Challenge extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'TR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '74';
        this.name = 'Challenge!';
        this.fullName = 'Challenge! TR';
        this.text = 'Ask your opponent if he or she accepts your challenge. If your opponent declines (or if both Benches are full), draw 2 cards. If your opponent accepts, each of you searches your decks for any number of Basic Pokémon cards and puts them face down onto your Benches. (A player can\'t do this if his or her Bench is full.) When you both have finished, shuffle your decks and turn those cards face up.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            effect.preventDefault = true;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            const playerOpenSlots = player.bench.filter(b => b.cards.length === 0);
            const opponentOpenSlots = opponent.bench.filter(b => b.cards.length === 0);
            if (playerOpenSlots.length === 0 && opponentOpenSlots.length === 0) {
                if (player.deck.cards.length === 0) {
                    throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                }
                else {
                    (0, prefabs_1.DRAW_CARDS)(player, 2);
                }
                return state;
            }
            state = store.prompt(state, new game_1.SelectOptionPrompt(opponent.id, game_1.GameMessage.CHOOSE_OPTION, [
                'I accept the challenge!',
                'I decline the challenge!'
            ], {
                allowCancel: false,
                defaultValue: 0
            }), choice => {
                if (choice === 0) {
                    // Challenge accepted
                    store.prompt(state, [
                        new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max: playerOpenSlots.length, allowCancel: false }),
                        new game_1.ChooseCardsPrompt(opponent, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, opponent.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max: opponentOpenSlots.length, allowCancel: false })
                    ], results => {
                        const playerCards = results[0] || [];
                        const opponentCards = results[1] || [];
                        playerCards.forEach((card, index) => {
                            player.deck.moveCardTo(card, playerOpenSlots[index]);
                            playerOpenSlots[index].pokemonPlayedTurn = state.turn;
                        });
                        opponentCards.forEach((card, index) => {
                            opponent.deck.moveCardTo(card, opponentOpenSlots[index]);
                            opponentOpenSlots[index].pokemonPlayedTurn = state.turn;
                        });
                        (0, prefabs_2.SHUFFLE_DECK)(store, state, player);
                        (0, prefabs_2.SHUFFLE_DECK)(store, state, opponent);
                    });
                }
                else {
                    // Challenge declined
                    (0, prefabs_1.DRAW_CARDS)(player, 2);
                }
            });
        }
        return state;
    }
}
exports.Challenge = Challenge;
