"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CounterCatcher = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class CounterCatcher extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '160';
        this.regulationMark = 'G';
        this.name = 'Counter Catcher';
        this.fullName = 'Counter Catcher PAR';
        this.text = `You can play this card only if you have more Prize Cards remaining than your opponent.

Switch in 1 of your opponent's Benched Pokémon to the Active Spot.`;
        this.COUNTER_CATCHER_MARKER = 'COUNTER_CATCHER_MARKER';
    }
    canPlay(store, state, player) {
        const opponent = state_utils_1.StateUtils.getOpponent(state, player);
        const hasBench = opponent.bench.some(b => b.cards.length > 0);
        if (player.getPrizeLeft() <= opponent.getPrizeLeft()) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
        }
        if (!hasBench) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
        }
        return true;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (player.getPrizeLeft() <= opponent.getPrizeLeft()) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            if (!hasBench) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Legacy implementation:
            // - Used a ChoosePokemonPrompt targeting opponent Bench.
            // - Switched opponent Active to selected Bench target.
            //
            // Converted to prefab version (SWITCH_IN_OPPONENT_BENCHED_POKEMON).
            (0, prefabs_1.SWITCH_IN_OPPONENT_BENCHED_POKEMON)(store, state, player, { allowCancel: false });
        }
        return state;
    }
}
exports.CounterCatcher = CounterCatcher;
