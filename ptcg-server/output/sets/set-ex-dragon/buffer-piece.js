"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufferPiece = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const state_utils_1 = require("../../game/store/state-utils");
const state_1 = require("../../game/store/state/state");
class BufferPiece extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'DR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '83';
        this.name = 'Buffer Piece';
        this.fullName = 'Buffer Piece DR';
        this.text = 'Damage done to the Pokémon Buffer Piece is attached to by an opponent\'s attack is reduced by 20 (after applying Weakness and Resistance). At the end of your opponent\'s turn after you played Buffer Piece, discard Buffer Piece.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            // Discard card at the end of opponent's turn
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                    if (cardList.tools.includes(this) && state_utils_1.StateUtils.findOwner(state, cardList) !== effect.player) {
                        // Check if tool is blocked before discarding
                        if (!(0, prefabs_1.IS_TOOL_BLOCKED)(store, state, state_utils_1.StateUtils.findOwner(state, cardList), this)) {
                            cardList.moveCardTo(this, player.discard);
                        }
                    }
                });
            });
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.tools.includes(this)) {
            if ((0, prefabs_1.IS_TOOL_BLOCKED)(store, state, effect.player, this)) {
                return state;
            }
            // It's not an attack
            if (state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            const player = state_utils_1.StateUtils.findOwner(state, effect.target);
            // Check if damage target is owned by this card's owner 
            const targetPlayer = state_utils_1.StateUtils.findOwner(state, effect.target);
            if (targetPlayer === player) {
                effect.reduceDamage(20);
            }
            return state;
        }
        return state;
    }
}
exports.BufferPiece = BufferPiece;
