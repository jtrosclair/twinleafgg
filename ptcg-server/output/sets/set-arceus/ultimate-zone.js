"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UltimateZone = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
class UltimateZone extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'AR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '91';
        this.name = 'Ultimate Zone';
        this.fullName = 'Ultimate Zone AR';
        this.text = 'During each player\'s turn, the player may move an Energy card attached to 1 of his or her Benched Pokémon to his or her Active Arceus as often as he or she likes.';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            if (((_a = player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name) !== 'Arceus') {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
            }
            store.prompt(state, new game_1.MoveEnergyPrompt(effect.player.id, game_message_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: true }), transfers => {
                if (transfers && transfers.length > 0) {
                    for (const transfer of transfers) {
                        const source = state_utils_1.StateUtils.getTarget(state, player, transfer.from);
                        const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
                        if (target !== player.active) {
                            throw new game_1.GameError(game_message_1.GameMessage.MOVE_ENERGY_TO_ACTIVE);
                        }
                        if (source && target) {
                            source.moveCardTo(transfer.card, target);
                        }
                    }
                }
            });
        }
        return state;
    }
}
exports.UltimateZone = UltimateZone;
