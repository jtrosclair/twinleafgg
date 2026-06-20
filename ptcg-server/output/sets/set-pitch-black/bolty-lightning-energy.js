"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoltyLightningEnergy = void 0;
const energy_card_1 = require("../../game/store/card/energy-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
/** Bolty Lightning Energy — set M5 card #80. */
class BoltyLightningEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'M5';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '80';
        this.name = 'Bolty [L] Energy';
        this.fullName = 'Bolty [L] Energy M5';
        this.text = `As long as this card is attached to a Pokémon, it provides [L] Energy.

The attacks of the [L] Pokémon this card is attached to do 20 more damage to your opponent's Active Pokémon (before applying Weakness and Resistance).`;
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
            effect.energyMap.push({ card: this, provides: [card_types_1.CardType.LIGHTNING] });
            return state;
        }
        // Ref: set-darkness-ablaze/powerful-colorless-energy.ts (type-checked + DealDamageBonus)
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.source.cards.includes(this)) {
            if ((0, prefabs_1.IS_SPECIAL_ENERGY_BLOCKED)(store, state, effect.player, this, effect.source)) {
                return state;
            }
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.source);
            store.reduceEffect(state, checkPokemonType);
            if (!checkPokemonType.cardTypes.includes(card_types_1.CardType.LIGHTNING)) {
                return state;
            }
            if (effect.damage && effect.damage > 0 && effect.target === effect.opponent.active) {
                effect.damage += 20;
            }
        }
        return state;
    }
}
exports.BoltyLightningEnergy = BoltyLightningEnergy;
