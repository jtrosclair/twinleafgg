"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComputerError = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class ComputerError extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.tags = [card_types_1.CardTag.ROCKETS_SECRET_MACHINE];
        this.set = 'PR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '16';
        this.name = 'Computer Error';
        this.fullName = 'Computer Error PR';
        this.text = 'You may draw up to 5 cards, then your opponent may draw up to 5 cards. Your turn is over now (you don\'t get to attack).';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            const maxPlayerDraw = 5;
            const options = [];
            for (let i = maxPlayerDraw; i >= 0; i--) {
                options.push({ message: `Draw ${i} card(s)`, value: i });
            }
            store.prompt(state, new game_1.SelectPrompt(player.id, game_1.GameMessage.WANT_TO_DRAW_CARDS, options.map(c => c.message), { allowCancel: false }), choice => {
                const numCardsToDraw = options[choice].value;
                player.deck.moveTo(player.hand, numCardsToDraw);
                const opponentOptions = [];
                for (let i = maxPlayerDraw; i >= 0; i--) {
                    opponentOptions.push({ message: `Draw ${i} card(s)`, value: i });
                }
                store.prompt(state, new game_1.SelectPrompt(opponent.id, game_1.GameMessage.WANT_TO_DRAW_CARDS, opponentOptions.map(c => c.message), { allowCancel: false }), opponentChoice => {
                    const opponentNumCardsToDraw = opponentOptions[opponentChoice].value;
                    opponent.deck.moveTo(opponent.hand, opponentNumCardsToDraw);
                });
            });
            // Pretty much just for Chaos Gym: if used while not your turn, there is no end turn effect
            // Better to refer to whoever's turn it is, but idk how to do that
            if (effect.player === game_1.StateUtils.findOwner(state, game_1.StateUtils.findCardList(state, this))) {
                const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
                store.reduceEffect(state, endTurnEffect);
            }
        }
        return state;
    }
}
exports.ComputerError = ComputerError;
