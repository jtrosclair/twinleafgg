"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlusPower = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
class PlusPower extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'BS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '84';
        this.name = 'PlusPower';
        this.fullName = 'PlusPower BS';
        this.putIntoPlay = true;
        this.text = 'Attach PlusPower to your Active Pokémon. At the end of your turn, discard PlusPower. If this Pokémon\'s attack does damage to the Defending Pokémon (after applying Weakness and Resistance), the attack does 10 more damage to the Defending Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            (0, prefabs_1.MOVE_CARD_TO)(state, this, player.active);
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.source.cards.includes(this)) {
            // must deal > 0 damage to active Pokémon
            const target = effect.target;
            if (effect.damage && effect.damage > 0 && (effect.target === effect.opponent.active || effect.target === effect.player.active)) {
                const additionalDamageEffect = new attack_effects_1.AfterWeaknessAndResistanceEffect(effect.attackEffect, 10);
                additionalDamageEffect.target = target;
                store.reduceEffect(state, additionalDamageEffect);
            }
        }
        // Discard PlusPower at the end of the turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, index) => {
                if (cardList.cards.includes(this)) {
                    cardList.moveCardTo(this, player.discard);
                }
            });
        }
        return state;
    }
}
exports.PlusPower = PlusPower;
