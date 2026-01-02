"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
class MultiEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'SS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '93';
        this.name = 'Multi Energy';
        this.fullName = 'Multi Energy SS';
        this.text = 'Attach Multi Energy to 1 of your Pokémon. While in play, Multi Energy provides every type of Energy but provides only 1 Energy at a time. (Doesn\'t count as a basic Energy card when not in play.) Multi energy provides [C] Energy when attached to a Pokémon that already has Special Energy cards attached to it.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            const attachedTo = effect.source;
            const otherSpecialEnergy = attachedTo.cards.some(card => {
                return card instanceof energy_card_1.EnergyCard
                    && card.energyType === card_types_1.EnergyType.SPECIAL
                    && card !== this;
            });
            if (otherSpecialEnergy) {
                effect.energyMap.push({ card: this, provides: [card_types_1.CardType.COLORLESS] });
            }
            else {
                effect.energyMap.push({ card: this, provides: [card_types_1.CardType.ANY] });
            }
            return state;
        }
        return state;
    }
}
exports.MultiEnergy = MultiEnergy;
