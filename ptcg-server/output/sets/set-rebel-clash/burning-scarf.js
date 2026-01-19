"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BurningScarf = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class BurningScarf extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.regulationMark = 'D';
        this.set = 'RCL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '155';
        this.name = 'Burning Scarf';
        this.fullName = 'Burning Scarf RCL';
        this.text = 'If the [R] Pokémon this card is attached to is in the Active Spot and is damaged by an opponent\'s attack (even if it is Knocked Out), the Attacking Pokémon is now Burned.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.target.tools.includes(this)) {
            const player = effect.player;
            const targetPlayer = game_1.StateUtils.findOwner(state, effect.target);
            if ((0, prefabs_1.IS_TOOL_BLOCKED)(store, state, targetPlayer, this)) {
                return state;
            }
            if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
                return state;
            }
            if (state.phase === state_1.GamePhase.ATTACK) {
                effect.source.addSpecialCondition(card_types_1.SpecialCondition.BURNED);
            }
        }
        return state;
    }
}
exports.BurningScarf = BurningScarf;
