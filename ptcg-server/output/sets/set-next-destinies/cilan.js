"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cilan = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class Cilan extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'NXD';
        this.setNumber = '86';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Cilan';
        this.fullName = 'Cilan NXD';
        this.text = 'Search your deck for up to 3 basic Energy cards, reveal them, and put them into your hand. Shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            // Count basic energy in deck
            const basicEnergyCount = player.deck.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY && c.energyType === card_types_1.EnergyType.BASIC).length;
            if (basicEnergyCount === 0) {
                // Still shuffle deck even if no energy found
                return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            }
            const maxToTake = Math.min(3, basicEnergyCount);
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: maxToTake, allowCancel: false }), selected => {
                const selectedCards = selected || [];
                if (selectedCards.length > 0) {
                    // Show cards to opponent
                    (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, selectedCards);
                    // Move cards to hand
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.deck, player.hand, { cards: selectedCards, sourceCard: this });
                }
                return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.Cilan = Cilan;
