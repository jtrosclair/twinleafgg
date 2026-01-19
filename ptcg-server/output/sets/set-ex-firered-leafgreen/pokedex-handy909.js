"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokeDexHANDY909 = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class PokeDexHANDY909 extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'RG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '96';
        this.name = 'PokéDex HANDY909';
        this.fullName = 'PokéDex HANDY909 RG';
        this.text = 'Shuffle your deck. Look at 6 cards from the top of your deck, then put them back on top of your deck in any order.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            const deckTop = new game_1.CardList();
            player.deck.moveTo(deckTop, 6);
            store.prompt(state, new game_1.OrderCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARDS_ORDER, deckTop, { allowCancel: false }), order => {
                if (order === null) {
                    return state;
                }
                deckTop.applyOrder(order);
                deckTop.moveToTopOfDestination(player.deck);
            });
            player.supporter.moveCardTo(this, player.discard);
        }
        return state;
    }
}
exports.PokeDexHANDY909 = PokeDexHANDY909;
