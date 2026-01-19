"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LookersInvestigation = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class LookersInvestigation extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'PL';
        this.name = 'Looker\'s Investigation';
        this.fullName = 'Looker\'s Investigation PL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '109';
        this.text = 'Look at your opponent\'s hand, then choose you or your opponent. That player shuffles his or her hand into his or her deck and draws up to 5 cards.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            effect.preventDefault = true;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, player, opponent.hand.cards);
            state = store.prompt(state, new game_1.SelectOptionPrompt(player.id, game_1.GameMessage.CHOOSE_OPTION, [
                'You shuffle your hand into your deck and draw 5 cards.',
                'Your opponent shuffles his or her hand into his or her deck and draws 5 cards.'
            ], {
                allowCancel: false,
                defaultValue: 0
            }), choice => {
                if (choice === 0) {
                    // Option 1
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.deck);
                    (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                    (0, prefabs_1.DRAW_CARDS)(player, 5);
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                }
                else if (choice === 1) {
                    // Option 2
                    (0, prefabs_1.MOVE_CARDS)(store, state, opponent.hand, opponent.deck);
                    (0, prefabs_1.SHUFFLE_DECK)(store, state, opponent);
                    (0, prefabs_1.DRAW_CARDS)(opponent, 5);
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                }
            });
        }
        return state;
    }
}
exports.LookersInvestigation = LookersInvestigation;
