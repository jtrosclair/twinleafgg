"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerfulColorlessEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class PowerfulColorlessEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'DAA';
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '176';
        this.name = 'Powerful Colorless Energy';
        this.fullName = 'Powerful Colorless Energy DAA';
        this.text = `As long as this card is attached to a Pokémon, it provides [C] Energy.
    
The attacks of the [C] Pokémon this card is attached to do 20 more damage to your opponent's Active Pokémon (before applying Weakness and Resistance).`;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.source.cards.includes(this)) {
            if ((0, prefabs_1.IS_SPECIAL_ENERGY_BLOCKED)(store, state, effect.player, this, effect.source)) {
                return state;
            }
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.source);
            store.reduceEffect(state, checkPokemonType);
            if (!checkPokemonType.cardTypes.includes(card_types_1.CardType.COLORLESS)) {
                return state;
            }
            if (effect.damage && effect.damage > 0 && effect.target === effect.opponent.active) {
                effect.damage += 20;
            }
        }
        return state;
    }
}
exports.PowerfulColorlessEnergy = PowerfulColorlessEnergy;
