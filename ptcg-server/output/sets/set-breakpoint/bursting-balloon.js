"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BurstingBalloon = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_1 = require("../../game");
class BurstingBalloon extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'BKP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '97';
        this.name = 'Bursting Balloon';
        this.fullName = 'Bursting Balloon BKP';
        this.text = 'If this card is attached to 1 of your Pokémon, discard it at the end of your opponent\'s turn.\n\nIf the Pokémon this card is attached to is your Active Pokémon and is damaged by an opponent\'s attack (even if that Pokémon is Knocked Out), put 6 damage counters on the Attacking Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.target.tools.includes(this)) {
            const player = effect.player;
            const targetPlayer = state_utils_1.StateUtils.findOwner(state, effect.target);
            // Try to reduce ToolEffect, to check if something is blocking the tool from working
            try {
                const stub = new play_card_effects_1.ToolEffect(effect.player, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
                return state;
            }
            if (state.phase === state_1.GamePhase.ATTACK) {
                effect.source.damage += 60;
            }
        }
        // Discard card at the end of opponent's turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                    if (cardList.tools.includes(this) && state_utils_1.StateUtils.findOwner(state, cardList) !== effect.player) {
                        cardList.moveCardTo(this, player.discard);
                    }
                });
            });
        }
        return state;
    }
}
exports.BurstingBalloon = BurstingBalloon;
