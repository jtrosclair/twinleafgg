"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Iris = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Iris extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'PLB';
        this.setNumber = '81';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Iris';
        this.fullName = 'Iris PLB';
        this.text = 'During this turn, your Pokémon\'s attacks do 10 more damage to the Active Pokémon for each Prize card your opponent has taken (before applying Weakness and Resistance). You may play only 1 Supporter card during your turn (before your attack).';
        this.IRIS_MARKER = 'IRIS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            player.marker.addMarker(this.IRIS_MARKER, this);
        }
        // Intercept DealDamageEffect to add bonus damage
        if (effect instanceof attack_effects_1.DealDamageEffect) {
            const player = effect.player;
            if (!player.marker.hasMarker(this.IRIS_MARKER, this)) {
                return state;
            }
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (effect.target !== opponent.active) {
                return state;
            }
            const prizesTaken = opponent.prizesTaken;
            if (prizesTaken > 0) {
                effect.damage += 10 * prizesTaken;
            }
        }
        // Clean up at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.IRIS_MARKER, this);
        }
        return state;
    }
}
exports.Iris = Iris;
