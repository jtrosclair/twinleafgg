"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaptivatingPokePuff = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class CaptivatingPokePuff extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'STS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '99';
        this.name = 'Captivating Poké Puff';
        this.fullName = 'Captivating Poké Puff STS';
        this.text = 'Your opponent reveals his or her hand. Put any number of Basic Pokémon you find there onto your opponent\'s Bench.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const slots = opponent.bench.filter(b => b.cards.length === 0);
            if (slots.length === 0) {
                // No open slots, throw error
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            if (opponent.hand.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const max = Math.min(opponent.hand.cards.filter(card => card instanceof game_1.PokemonCard && card.stage === card_types_1.Stage.BASIC).length, slots.length);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, opponent.hand, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max, allowCancel: true }), selected => {
                const cards = selected || [];
                // Operation canceled by the user
                if (cards.length === 0) {
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                    return;
                }
                cards.forEach((card, index) => {
                    opponent.hand.moveCardTo(card, slots[index]);
                    slots[index].pokemonPlayedTurn = state.turn;
                });
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
            });
        }
        return state;
    }
}
exports.CaptivatingPokePuff = CaptivatingPokePuff;
