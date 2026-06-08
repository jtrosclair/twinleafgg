"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoxiesPerformance = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const card_types_2 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_2 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const ROXIE_POISONED_NO_RETREAT = 'ROXIE_POISONED_NO_RETREAT';
class RoxiesPerformance extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '77';
        this.usSetNumber = 'CRI 81';
        this.name = 'Roxie\'s Performance';
        this.fullName = 'Roxie\'s Performance M4';
        this.text = 'During your opponent\'s next turn, their Poisoned Pokemon can\'t retreat.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.ADD_MARKER)(ROXIE_POISONED_NO_RETREAT, opponent, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, ROXIE_POISONED_NO_RETREAT, this);
        }
        if (effect instanceof game_effects_1.RetreatEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.marker.hasMarker(ROXIE_POISONED_NO_RETREAT, this)) {
                const isPoisoned = player.active.specialConditions.includes(card_types_2.SpecialCondition.POISONED);
                if (isPoisoned) {
                    throw new game_2.GameError(game_2.GameMessage.BLOCKED_BY_EFFECT);
                }
            }
        }
        return state;
    }
}
exports.RoxiesPerformance = RoxiesPerformance;
