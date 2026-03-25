"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhoebesStadium = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const state_1 = require("../../game/store/state/state");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
class PhoebesStadium extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'PK';
        this.name = 'Phoebe\'s Stadium';
        this.fullName = 'Phoebe\'s Stadium PK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '79';
        this.text = 'Each player pays [C][C] less to retreat his or her [P] Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && state_utils_1.StateUtils.getStadiumCard(state) === this && state.phase !== state_1.GamePhase.ATTACK) {
            const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(effect.player.active);
            store.reduceEffect(state, checkPokemonTypeEffect);
            if (checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.PSYCHIC)) {
                for (let i = 0; i < 2; i++) {
                    const colorlessIndex = effect.cost.lastIndexOf(card_types_1.CardType.COLORLESS);
                    if (colorlessIndex === -1) {
                        break;
                    }
                    effect.cost.splice(colorlessIndex, 1);
                }
            }
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.PhoebesStadium = PhoebesStadium;
