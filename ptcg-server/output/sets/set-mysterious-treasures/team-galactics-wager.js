"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamGalacticsWager = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class TeamGalacticsWager extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'MT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '115';
        this.name = 'Team Galactic\'s Wager';
        this.fullName = 'Team Galactic\'s Wager MT';
        this.text = 'Each player shuffles his or her hand into his or her deck, and you and your opponent play "Rock-Paper-Scissors." The player who wins draws up to 6 cards. The player who loses draws up to 3 cards. (You draw your cards first.)';
    }
    reduceEffect(store, state, effect) {
        if (trainer_prefabs_1.WAS_TRAINER_USED(effect, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            effect.preventDefault = true;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            const cards = player.hand.cards.filter(c => c !== this);
            const opponentCards = opponent.hand.cards.filter(c => c !== this);
            if (cards.length === 0 && player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardsTo(cards, player.deck);
            opponent.hand.moveCardsTo(opponentCards, opponent.deck);
            prefabs_1.SHUFFLE_DECK(store, state, player);
            prefabs_1.SHUFFLE_DECK(store, state, opponent);
            const options = [
                { value: 'Rock', message: 'Rock' },
                { value: 'Paper', message: 'Paper' },
                { value: 'Scissors', message: 'Scissors' }
            ];
            // Default to player losing
            let maxPlayerDraw = 3;
            let maxOpponentDraw = 6;
            // simultaneous prompt showing gaming
            store.prompt(state, [
                new game_1.SelectPrompt(player.id, game_1.GameMessage.CHOOSE_OPTION, options.map(c => c.message), { allowCancel: false }),
                new game_1.SelectPrompt(opponent.id, game_1.GameMessage.CHOOSE_OPTION, options.map(c => c.message), { allowCancel: false }),
            ], results => {
                // variable time
                const playerChosenValue = results[0];
                const opponentChosenValue = results[1];
                // outputting what both players chose
                store.log(state, game_1.GameLog.LOG_PLAYER_CHOOSES, { name: player.name, string: options[playerChosenValue].message });
                store.log(state, game_1.GameLog.LOG_PLAYER_CHOOSES, { name: opponent.name, string: options[opponentChosenValue].message });
                // if they tie, restart it
                if (playerChosenValue === opponentChosenValue) {
                    return this.reduceEffect(store, state, effect);
                }
                // Gotta make the win conditions (where player wins)
                if ((playerChosenValue === 1 && opponentChosenValue === 0)
                    || (playerChosenValue === 2 && opponentChosenValue === 1)
                    || (playerChosenValue === 0 && opponentChosenValue === 2)) {
                    maxPlayerDraw = 6;
                    maxOpponentDraw = 3;
                    prefabs_1.DRAW_UP_TO_X_CARDS(store, state, player, maxPlayerDraw);
                    prefabs_1.DRAW_UP_TO_X_CARDS(store, state, opponent, maxOpponentDraw);
                }
            });
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
        return state;
    }
}
exports.TeamGalacticsWager = TeamGalacticsWager;
