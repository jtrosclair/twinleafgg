"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrowGrassEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class GrowGrassEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.GRASS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.regulationMark = 'J';
        this.set = 'M3';
        this.name = 'Grow [G] Energy';
        this.fullName = 'Grow [G] Energy M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '78';
        this.usSetNumber = 'POR 86';
        this.text = 'This card provides [G] Energy while this card is attached to a Pokemon.\n\nThe [G] Pokemon this card is attached to gets +20 HP.';
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        // Provide [G] Energy
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            effect.energyMap.push({ card: this, provides: [card_types_1.CardType.GRASS] });
        }
        // Add +20 HP to Grass Pokemon
        if (effect instanceof check_effects_1.CheckHpEffect && ((_b = (_a = effect.target) === null || _a === void 0 ? void 0 : _a.cards) === null || _b === void 0 ? void 0 : _b.includes(this))) {
            if ((0, prefabs_1.IS_SPECIAL_ENERGY_BLOCKED)(store, state, effect.player, this, effect.target)) {
                return state;
            }
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            store.reduceEffect(state, checkPokemonType);
            if (checkPokemonType.cardTypes.includes(card_types_1.CardType.GRASS)) {
                effect.hp += 20;
            }
        }
        return state;
    }
}
exports.GrowGrassEnergy = GrowGrassEnergy;
