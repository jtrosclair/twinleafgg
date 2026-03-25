"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnergyPickup = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class EnergyPickup extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.superType = card_types_1.SuperType.TRAINER;
        this.set = 'LA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '132';
        this.name = 'Energy Pickup';
        this.fullName = 'Energy Pickup LA';
        this.text = 'Flip a coin. If heads, search your discard pile for a basic Energy card and attach it to 1 of your Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c.superType === card_types_1.SuperType.ENERGY
                    && c.energyType === card_types_1.EnergyType.BASIC;
            });
            if (!hasEnergyInDiscard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (!result) {
                    return state;
                }
                if (result === true) {
                    const player = effect.player;
                    state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 1, max: 1 }), transfers => {
                        transfers = transfers || [];
                        // cancelled by user
                        if (transfers.length === 0) {
                            return;
                        }
                        for (const transfer of transfers) {
                            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                            player.discard.moveCardTo(transfer.card, target);
                        }
                    });
                    return state;
                }
                return state;
            });
        }
        return state;
    }
}
exports.EnergyPickup = EnergyPickup;
