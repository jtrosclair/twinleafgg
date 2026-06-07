"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RockFightingEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const state_utils_1 = require("../../game/store/state-utils");
class RockFightingEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.regulationMark = 'J';
        this.set = 'M3';
        this.name = 'Rock Fighting Energy';
        this.fullName = 'Rock Fighting Energy M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '80';
        this.usSetNumber = 'POR 87';
        this.text = `This card provides [F] Energy while this card is attached to a Pokémon.
  
  Prevent all effects of attacks used by your opponent's Pokémon done to the [F] Pokémon this card is attached to. (Existing effects are not removed. Damage is not an effect.)`;
    }
    reduceEffect(store, state, effect) {
        var _a;
        // Provide energy when attached to Fighting Pokemon
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            effect.energyMap.push({ card: this, provides: [card_types_1.CardType.FIGHTING] });
        }
        // Prevent effects of attacks
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.cards.includes(this) && ((_a = effect.target.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.cardType) === card_types_1.CardType.FIGHTING) {
            const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
            if ((0, prefabs_1.IS_SPECIAL_ENERGY_BLOCKED)(store, state, opponent, this, effect.target)) {
                return state;
            }
            const sourceCard = effect.source.getPokemonCard();
            if (sourceCard) {
                // Allow Weakness & Resistance
                if (effect instanceof attack_effects_1.ApplyWeaknessEffect) {
                    return state;
                }
                // Allow damage
                if (effect instanceof attack_effects_1.PutDamageEffect) {
                    return state;
                }
                if (effect instanceof attack_effects_1.DealDamageEffect) {
                    return state;
                }
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.RockFightingEnergy = RockFightingEnergy;
