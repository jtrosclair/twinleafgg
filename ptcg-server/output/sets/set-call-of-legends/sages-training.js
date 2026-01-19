"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SagesTraining = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class SagesTraining extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'CL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '85';
        this.name = 'Sage\'s Training';
        this.fullName = 'Sage\'s Training CL';
        this.text = 'Look at the top 5 cards of your deck. Choose any 2 cards you find there and put them into your hand. Discard the other cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.ancientSupporter) {
            effect.player.ancientSupporter = false;
        }
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const deckTop = new game_1.CardList();
            player.deck.moveTo(deckTop, 5);
            const min = player.deck.cards.length > 1 ? Math.min(2, deckTop.cards.length) : 1;
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, deckTop, {}, { min, max: 2, allowCancel: false }), selected => {
                player.ancientSupporter = true;
                deckTop.moveCardsTo(selected, player.hand);
                deckTop.moveTo(player.discard);
                (0, prefabs_1.CLEAN_UP_SUPPORTER)(effect, player);
            });
        }
        return state;
    }
}
exports.SagesTraining = SagesTraining;
