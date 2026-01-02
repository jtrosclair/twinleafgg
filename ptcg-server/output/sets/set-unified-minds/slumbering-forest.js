"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlumberingForest = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class SlumberingForest extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'UNM';
        this.name = 'Slumbering Forest';
        this.fullName = 'Slumbering Forest UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '207';
        this.text = 'If a Pokémon is Asleep, its owner flips 2 coins instead of 1 for that Special Condition between turns. If either of them is tails, that Pokémon is still Asleep.';
        this.SLUMBERING_MARKER = 'SLUMBERING_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            const players = [effect.player, game_1.StateUtils.getOpponent(state, effect.player)];
            players.forEach(player => {
                if (player.active.specialConditions.includes(card_types_1.SpecialCondition.ASLEEP)) {
                    // observed as asleep end turn
                    prefabs_1.ADD_MARKER(this.SLUMBERING_MARKER, player, this);
                }
            });
        }
        if (effect instanceof game_phase_effects_1.BeginTurnEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            const players = [effect.player, game_1.StateUtils.getOpponent(state, effect.player)];
            players.forEach(player => {
                if (!player.active.specialConditions.includes(card_types_1.SpecialCondition.ASLEEP) && prefabs_1.HAS_MARKER(this.SLUMBERING_MARKER, player, this)) {
                    // heads on first coin flip, now flip again
                    prefabs_1.COIN_FLIP_PROMPT(store, state, player, (result) => {
                        if (!result) {
                            player.active.addSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
                        }
                    });
                    prefabs_1.REMOVE_MARKER(this.SLUMBERING_MARKER, player, this);
                }
                else {
                    prefabs_1.REMOVE_MARKER(this.SLUMBERING_MARKER, player, this);
                }
            });
        }
        return state;
    }
}
exports.SlumberingForest = SlumberingForest;
