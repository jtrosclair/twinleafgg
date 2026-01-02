"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerTree = void 0;
const game_1 = require("../../game");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const state_utils_1 = require("../../game/store/state-utils");
class PowerTree extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '76';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'LM';
        this.name = 'Power Tree';
        this.fullName = 'Power Tree LM';
        this.text = 'Once during each player\'s turn, if the player has no Special Energy cards in his or her discard pile, that player searches his or her discard pile for a basic Energy card, show it to the opponent, and put it into his or her hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Check if DiscardToHandEffect is prevented
            const discardEffect = new play_card_effects_1.DiscardToHandEffect(player, this);
            store.reduceEffect(state, discardEffect);
            if (discardEffect.preventDefault) {
                return state;
            }
            let basicEnergyInDiscard = 0;
            let specialEnergyInDiscard = 0;
            const blocked = [];
            player.discard.cards.forEach((c, index) => {
                if (c instanceof game_1.EnergyCard) {
                    if (c.energyType === card_types_1.EnergyType.BASIC) {
                        basicEnergyInDiscard += 1;
                    }
                    if (c.energyType === card_types_1.EnergyType.SPECIAL) {
                        specialEnergyInDiscard += 1;
                    }
                }
                else {
                    blocked.push(index);
                }
            });
            if (specialEnergyInDiscard !== 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
            }
            if (basicEnergyInDiscard === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
            }
            let cards = [];
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: 1, allowCancel: false, blocked }), selectedCards => {
                cards = selectedCards || [];
                // Operation canceled by the user
                if (cards.length === 0) {
                    return state;
                }
                if (cards.length > 0) {
                    store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => {
                        cards.forEach((card, index) => {
                            prefabs_1.MOVE_CARDS(store, state, player.discard, player.hand, { cards: [card], sourceCard: this });
                        });
                        cards.forEach((card, index) => {
                            store.log(state, game_message_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                        });
                    });
                }
            });
        }
        return state;
    }
}
exports.PowerTree = PowerTree;
