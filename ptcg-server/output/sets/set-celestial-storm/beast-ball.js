"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeastBall = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class BeastBall extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.ITEM;
        this.set = 'CES';
        this.name = 'Beast Ball';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '125';
        this.fullName = 'Beast Ball CES';
        this.text = 'Look at your face-down Prize cards. You may reveal an Ultra Beast card you find there, put it into your hand, and put this Beast Ball in its place. (If you don\'t reveal an Ultra Beast card, put this card in the discard pile.) Then, shuffle your face-down Prize cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const prizes = player.prizes.filter(p => p.isSecret);
            // Keep track of which prizes were originally face down
            const originallyFaceDown = player.prizes.map(p => p.isSecret);
            // If there are no prizes originally face down, this card can't be played
            let faceDownCheck = 0;
            player.prizes.forEach(card => {
                if (card.isSecret) {
                    faceDownCheck++;
                }
            });
            if (!faceDownCheck) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Make prizes no longer secret before displaying prompt
            prizes.forEach(p => { p.isSecret = false; });
            // Prevent default effect and move the trainer card to the supporter area
            effect.preventDefault = true;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // Gather all prize cards for the prompt
            const allPrizeCards = new game_1.CardList();
            player.prizes.forEach(prizeList => {
                allPrizeCards.cards.push(...prizeList.cards);
            });
            // Prompt the player to choose an Ultra Beast from their prizes
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, allPrizeCards, { superType: game_1.SuperType.POKEMON, tags: [game_1.CardTag.ULTRA_BEAST] }, { min: 0, max: 1, allowCancel: false }), chosenPrize => {
                // Handle the case where no Ultra Beast is chosen - discard Beast Ball
                if (!chosenPrize || chosenPrize.length === 0) {
                    player.prizes.forEach((p, index) => {
                        if (originallyFaceDown[index]) {
                            p.isSecret = true;
                        }
                    });
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                    this.shuffleFaceDownPrizeCards(player.prizes.filter((p, index) => originallyFaceDown[index]));
                    return state;
                }
                const prizeCard = chosenPrize[0];
                const chosenPrizeList = player.prizes.find(prizeList => prizeList.cards.includes(prizeCard));
                // Show the chosen Ultra Beast to the opponent
                if (chosenPrize.length > 0) {
                    state = store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, chosenPrize), () => { });
                }
                // Move the chosen Ultra Beast to the player's hand & move the Beast Ball to the prize cards
                if (chosenPrizeList) {
                    chosenPrizeList.moveCardTo(prizeCard, player.hand);
                    player.supporter.moveCardTo(effect.trainerCard, chosenPrizeList);
                }
                // Reset the face-down prizes
                player.prizes.forEach((p, index) => {
                    if (originallyFaceDown[index]) {
                        p.isSecret = true;
                    }
                });
                // Shuffle only the face-down prize cards
                this.shuffleFaceDownPrizeCards(player.prizes.filter((p, index) => originallyFaceDown[index]));
                return state;
            });
        }
        return state;
    }
    shuffleFaceDownPrizeCards(array) {
        const faceDownPrizeCards = array.filter(p => p.isSecret && p.cards.length > 0);
        for (let i = faceDownPrizeCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = faceDownPrizeCards[i];
            faceDownPrizeCards[i] = faceDownPrizeCards[j];
            faceDownPrizeCards[j] = temp;
        }
        const prizePositions = [];
        for (let i = 0; i < array.length; i++) {
            if (array[i].cards.length === 0 || !array[i].isSecret) {
                prizePositions.push(array[i]);
                continue;
            }
            prizePositions.push(faceDownPrizeCards.splice(0, 1)[0]);
        }
        return prizePositions;
    }
}
exports.BeastBall = BeastBall;
