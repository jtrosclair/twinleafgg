"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShadowDarknessEnergy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const state_1 = require("../../game/store/state/state");
class ShadowDarknessEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'M5';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '81';
        this.name = 'Shadow Darkness Energy';
        this.fullName = 'Shadow Darkness Energy M5';
        this.text = `As long as this card is attached to a Pokémon, it provides [D] Energy.

Prevent all damage done by your opponent's attacks to the Benched [D] Pokémon this card is attached to.`;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            try {
                const energyEffect = new play_card_effects_1.EnergyEffect(effect.player, this);
                store.reduceEffect(state, energyEffect);
            }
            catch (_a) {
                return state;
            }
            effect.energyMap.push({ card: this, provides: [card_types_1.CardType.DARK] });
            return state;
        }
        // Ref: set-temporal-forces/mist-energy.ts (IS_SPECIAL_ENERGY_BLOCKED / target owner),
        //      AGENTS.md (GamePhase.ATTACK for attack-sourced damage prevention)
        if ((effect instanceof attack_effects_1.DealDamageEffect || effect instanceof attack_effects_1.PutDamageEffect)
            && state.phase === state_1.GamePhase.ATTACK
            && effect.target.cards.includes(this)) {
            const defenderOwner = game_1.StateUtils.findOwner(state, effect.target);
            if (effect.target === defenderOwner.active) {
                return state;
            }
            if (game_1.StateUtils.getOpponent(state, defenderOwner) !== effect.player) {
                return state;
            }
            if ((0, prefabs_1.IS_SPECIAL_ENERGY_BLOCKED)(store, state, defenderOwner, this, effect.target)) {
                return state;
            }
            const checkType = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            store.reduceEffect(state, checkType);
            if (!checkType.cardTypes.includes(card_types_1.CardType.DARK)) {
                return state;
            }
            effect.damage = 0;
        }
        return state;
    }
}
exports.ShadowDarknessEnergy = ShadowDarknessEnergy;
