"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeltaRainbowEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
class DeltaRainbowEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'HP';
        this.name = 'Delta Rainbow Energy';
        this.fullName = 'Delta Rainbow Energy HP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '98';
        this.text = 'δ Rainbow Energy provides [C] Energy. While attached to a Pokémon that has δ on its card, δ Rainbow Energy provides every type of Energy but provides only 1 Energy at a time. (Has no effect other than providing Energy.)';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect
            && effect.source.cards.includes(this)
            && ((_a = effect.source.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.DELTA_SPECIES))) {
            effect.energyMap.push({ card: this, provides: [card_types_1.CardType.ANY] });
        }
        return state;
    }
}
exports.DeltaRainbowEnergy = DeltaRainbowEnergy;
