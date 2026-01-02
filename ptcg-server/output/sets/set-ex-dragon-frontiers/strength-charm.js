"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrengthCharm = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const state_utils_1 = require("../../game/store/state-utils");
class StrengthCharm extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'DF';
        this.name = 'Strength Charm';
        this.fullName = 'Strength Charm DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '81';
        this.text = 'Whenever an attack from the Pokémon that Strength Charm is attached to does damage to the Active Pokémon, this attack does 10 more damage (before applying Weakness and Resistance). Discard Strength Charm at the end of the turn in which this Pokémon attacks.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.player.active.tools.includes(this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
            if (prefabs_1.IS_TOOL_BLOCKED(store, state, effect.player, this)) {
                return state;
            }
            if (effect.target !== player.active && effect.target !== opponent.active) {
                return state;
            }
            const attack = effect.attack;
            if (attack && attack.damage > 0 && effect.target === opponent.active) {
                effect.damage += 10;
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, index) => {
                    if (cardList.tools && cardList.tools.includes(this)) {
                        cardList.moveCardTo(this, player.discard);
                    }
                });
            }
        }
        return state;
    }
}
exports.StrengthCharm = StrengthCharm;
