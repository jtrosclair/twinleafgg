"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterBall = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class MasterBall extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'DX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '88';
        this.name = 'Master Ball';
        this.fullName = 'Master Ball DX';
        this.text = 'Look at the top 7 cards from your deck. Choose a Basic Pokémon or Evolution card from those cards, show it to your opponent, and put it into your hand. Put the other 6 cards back on top of your deck. Shuffle your deck afterward.';
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
            player.deck.moveTo(temp, 7);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, temp, { superType: card_types_1.SuperType.POKEMON }, { allowCancel: false, min: 0, max: 1 }), chosenCards => {
                if (chosenCards.length <= 0) {
                    // No Pokemon chosen, shuffle all back
                    temp.cards.forEach(card => {
                        temp.moveTo(player.deck);
                        player.supporter.moveCardTo(this, player.discard);
                    });
                }
                if (chosenCards.length > 0) {
                    // Move chosen Pokemon to hand
                    const pokemon = chosenCards[0];
                    temp.moveCardTo(pokemon, player.hand);
                    temp.moveTo(player.deck);
                    player.supporter.moveCardTo(this, player.discard);
                    chosenCards.forEach((card, index) => {
                        store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                    });
                    if (chosenCards.length > 0) {
                        state = store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, chosenCards), () => state);
                    }
                }
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.MasterBall = MasterBall;
