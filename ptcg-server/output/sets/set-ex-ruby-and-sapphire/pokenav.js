"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokeNav = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class PokeNav extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'RS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '88';
        this.name = 'PokéNav';
        this.fullName = 'PokéNav RS';
        this.text = 'Look at the top 3 cards of your deck. You may reveal a Pokémon or Energy card you find there and put it into your hand. Put the other cards back in any order.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const temp = new game_1.CardList();
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            player.deck.moveTo(temp, 3);
            const blocked = [];
            temp.cards.forEach((c, index) => {
                const isPokemon = c instanceof game_1.PokemonCard;
                const isBasicEnergy = c instanceof game_1.EnergyCard;
                if (!isPokemon && !isBasicEnergy) {
                    blocked.push(index);
                }
            });
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, temp, {}, { allowCancel: false, min: 0, max: 1, blocked }), chosenCards => {
                if (chosenCards.length > 0) {
                    // Move chosen card to hand
                    const chosen = chosenCards[0];
                    temp.moveCardTo(chosen, player.hand);
                    (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, chosenCards);
                    chosenCards.forEach((card, index) => {
                        store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                    });
                }
                // Create a CardList of the remaining cards (excluding the chosen card)
                const remaining = new game_1.CardList();
                temp.cards.forEach(card => {
                    if (!chosenCards.includes(card)) {
                        remaining.cards.push(card);
                    }
                });
                store.prompt(state, new game_1.OrderCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARDS_ORDER, remaining, { allowCancel: false }), order => {
                    if (order === null) {
                        return state;
                    }
                    remaining.applyOrder(order);
                    remaining.moveToTopOfDestination(player.deck);
                });
                player.supporter.moveCardTo(this, player.discard);
            });
        }
        return state;
    }
}
exports.PokeNav = PokeNav;
