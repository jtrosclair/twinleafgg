"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetalEnergySpecial = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class MetalEnergySpecial extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.METAL];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'AQ';
        this.name = 'Metal Energy';
        this.fullName = 'Metal Energy AQ';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '143';
        this.text = 'Damage done to the Pokémon Metal Energy is attached to is reduced by 10 (after applying Weakness and Resistance). If the Pokémon Metal Energy is attached to isn\'t [M], whenever it damages a Pokémon, reduce that damage by 10 (before applying Weakness and Resistance). Metal Energy provides [M] Energy. (Doesn\'t count as a basic Energy card.)';
    }
    reduceEffect(store, state, effect) {
        // reduce damage if this mon isn't metal
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            if (effect.source.cards.includes(this)) {
                const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.source);
                store.reduceEffect(state, checkPokemonType);
                if (!checkPokemonType.cardTypes.includes(card_types_1.CardType.METAL)) {
                    effect.damage -= 10;
                }
            }
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            effect.damage -= 10;
        }
        return state;
    }
}
exports.MetalEnergySpecial = MetalEnergySpecial;
