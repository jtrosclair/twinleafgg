"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuckyEgg = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const state_utils_1 = require("../../game/store/state-utils");
class LuckyEgg extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'AR';
        this.name = 'Lucky Egg';
        this.fullName = 'Lucky Egg AR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '88';
        this.text = 'When the Pokémon this card is attached to is Knocked Out by damage from an opponent\'s attack, draw cards until you have 7 cards in your hand.';
        this.damageDealt = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.player.active.tools.includes(this)) {
            this.damageDealt = false;
        }
        if ((effect instanceof attack_effects_1.DealDamageEffect || effect instanceof attack_effects_1.PutDamageEffect) &&
            effect.target.tools.includes(this)) {
            const player = state_utils_1.StateUtils.getOpponent(state, effect.player);
            if (player.active.tools.includes(this)) {
                this.damageDealt = true;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player === state_utils_1.StateUtils.getOpponent(state, effect.player)) {
            const cardList = state_utils_1.StateUtils.findCardList(state, this);
            const owner = state_utils_1.StateUtils.findOwner(state, cardList);
            if ((0, prefabs_1.IS_TOOL_BLOCKED)(store, state, effect.player, this)) {
                return state;
            }
            if (owner === effect.player) {
                this.damageDealt = false;
            }
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.tools.includes(this)) {
            const player = effect.player;
            // const target = effect.target;
            if ((0, prefabs_1.IS_TOOL_BLOCKED)(store, state, effect.player, this)) {
                return state;
            }
            if (this.damageDealt) {
                (0, prefabs_1.DRAW_CARDS_UNTIL_CARDS_IN_HAND)(player, 7);
            }
            return state;
        }
        return state;
    }
}
exports.LuckyEgg = LuckyEgg;
