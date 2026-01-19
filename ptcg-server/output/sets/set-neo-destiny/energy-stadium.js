"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnergyStadium = void 0;
const game_1 = require("../../game");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const state_utils_1 = require("../../game/store/state-utils");
class EnergyStadium extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '99';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'N4';
        this.name = 'Energy Stadium';
        this.fullName = 'Energy Stadium N4';
        this.text = 'Once during each player\'s turn (before attacking), that player may flip a coin. If heads, that player puts a basic Energy card from his or her discard pile into his or her hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            // Check if DiscardToHandEffect is prevented
            const discardEffect = new play_card_effects_1.DiscardToHandEffect(player, this);
            store.reduceEffect(state, discardEffect);
            if (discardEffect.preventDefault) {
                // If prevented, just discard the card and return
                player.supporter.moveCardTo(effect.stadium, player.discard);
                return state;
            }
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            let basicEnergyInDiscard = 0;
            const blocked = [];
            player.discard.cards.forEach((c, index) => {
                const isPokemon = c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC;
                if (isPokemon) {
                    basicEnergyInDiscard += 1;
                }
                else {
                    blocked.push(index);
                }
            });
            if (basicEnergyInDiscard === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    let cards = [];
                    store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: 1, allowCancel: false, blocked }), selectedCards => {
                        cards = selectedCards || [];
                        // Operation canceled by the user
                        if (cards.length === 0) {
                            return state;
                        }
                        if (cards.length > 0) {
                            (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, cards);
                        }
                        cards.forEach((card, index) => {
                            player.discard.moveCardTo(card, player.hand);
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
exports.EnergyStadium = EnergyStadium;
