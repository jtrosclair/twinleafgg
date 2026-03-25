"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VictoryRing = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class VictoryRing extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.ITEM;
        this.set = 'UP';
        this.name = 'Victory Ring';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '101';
        this.fullName = 'Victory Ring UP';
        this.text = 'Victory Ring can only be used by official tournament winners.\n\nTurn all of your Prize cards face up. You may choose any number of them and return them to your deck. If you do, shuffle your deck. Then, take the same number of cards from the top of your deck and put them face down as your Prize cards without looking at them.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            const prizes = player.prizes.filter(p => p.cards.length > 0);
            const allPrizeCards = new game_1.CardList();
            prizes.forEach(p => allPrizeCards.cards.push(...p.cards));
            if (allPrizeCards.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Refs: set-legends-awakened/azelf.ts (temporarily reveal then re-hide prizes),
            // set-astral-radiance/hisuian-heavy-ball.ts (ChooseCardsPrompt over prize cards)
            prizes.forEach(p => { p.isSecret = false; });
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DECK, allPrizeCards, {}, { min: 0, max: allPrizeCards.cards.length, allowCancel: false }), selected => {
                if (selected && selected.length > 0) {
                    selected.forEach((card) => {
                        const sourcePrize = player.prizes.find(p => p.cards.includes(card));
                        if (sourcePrize) {
                            sourcePrize.moveCardTo(card, player.deck);
                        }
                    });
                    (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                    player.prizes
                        .filter(p => p.cards.length === 0)
                        .forEach(emptyPrize => {
                        player.deck.moveTo(emptyPrize, 1);
                        emptyPrize.isSecret = true;
                    });
                }
            });
        }
        return state;
    }
}
exports.VictoryRing = VictoryRing;
