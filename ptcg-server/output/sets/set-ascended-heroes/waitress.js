"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Waitress = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class Waitress extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.SUPPORTER;
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '215';
        this.name = 'Waitress';
        this.fullName = 'Waitress MC';
        this.text = 'Look at the top 6 cards of your deck, and attach a Basic Energy you find there to 1 of your Pokémon. Shuffle the other cards back into your deck.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const deckTop = new game_1.CardList();
            const cardsToLook = Math.min(6, player.deck.cards.length);
            player.deck.moveTo(deckTop, cardsToLook);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, deckTop, { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC }, { min: 0, max: 1, allowCancel: false }), selected => {
                const cards = selected || [];
                if (cards.length > 0) {
                    // Attach the selected energy
                    return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, deckTop, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], {}, { allowCancel: false, min: 1, max: 1 }), transfers => {
                        transfers = transfers || [];
                        if (transfers.length > 0) {
                            for (const transfer of transfers) {
                                const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                                deckTop.moveCardTo(transfer.card, target);
                            }
                        }
                        // Put remaining cards back into deck
                        deckTop.moveTo(player.deck);
                        (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                    });
                }
                else {
                    // No energy selected, put all cards back
                    deckTop.moveTo(player.deck);
                    (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                }
            });
        }
        return state;
    }
}
exports.Waitress = Waitress;
