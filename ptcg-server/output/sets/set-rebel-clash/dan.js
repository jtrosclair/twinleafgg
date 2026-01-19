"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dan = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dan extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'RCL';
        this.name = 'Dan';
        this.fullName = 'Dan RCL';
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '158';
        this.text = 'Draw 2 cards. You and your opponent play Rock-Paper-Scissors until someone wins. If you win, draw 2 more cards.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            (0, prefabs_1.DRAW_CARDS)(player, 2);
            const options = [
                { value: 'Rock', message: 'Rock' },
                { value: 'Paper', message: 'Paper' },
                { value: 'Scissors', message: 'Scissors' }
            ];
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
                // Gotta make the win conditions
                if ((playerChosenValue === 1 && opponentChosenValue === 0)
                    || (playerChosenValue === 2 && opponentChosenValue === 1)
                    || (playerChosenValue === 0 && opponentChosenValue === 2)) {
                    (0, prefabs_1.DRAW_CARDS)(player, 2);
                }
            });
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
        return state;
    }
}
exports.Dan = Dan;
