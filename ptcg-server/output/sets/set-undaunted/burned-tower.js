"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BurnedTower = void 0;
const game_message_1 = require("../../game/game-message");
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class BurnedTower extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'UD';
        this.name = 'Burned Tower';
        this.fullName = 'Burned Tower UD';
        this.text = 'Once during each player\'s turn, that player may flip a coin. If heads, the player searches his or her discard pile for a basic Energy card, shows it to his or her opponent, and puts it into his or her hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            if (!player.discard.cards.some(card => card.superType === card_types_1.SuperType.ENERGY && card.energyType === card_types_1.EnergyType.BASIC)) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
            }
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    (0, prefabs_1.SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND)(store, state, player, this, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 1, max: 1 });
                }
            });
        }
        return state;
    }
}
exports.BurnedTower = BurnedTower;
