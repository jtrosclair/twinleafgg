"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FadedTown = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_2 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class FadedTown extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_2.TrainerType.STADIUM;
        this.set = 'AOR';
        this.setNumber = '73';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Faded Town';
        this.fullName = 'Faded Town AOR';
        this.text = 'At any time between turns, put 2 damage counters on each Mega Evolution Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                const pokemon = cardList.getPokemonCard();
                if (pokemon && pokemon.stage === card_types_1.Stage.MEGA) {
                    cardList.damage += 2;
                }
            });
            if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_STADIUM);
            }
        }
        return state;
    }
}
exports.FadedTown = FadedTown;
