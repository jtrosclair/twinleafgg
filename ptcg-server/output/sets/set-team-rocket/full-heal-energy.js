"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FullHealEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class FullHealEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'TR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '81';
        this.name = 'Full Heal Energy';
        this.fullName = 'Full Heal Energy TR';
        this.text = 'If you play this card from your hand, the Pokémon you attach it to is no longer Asleep, Confused, Paralyzed, or Poisoned.\n\nFull Heal Energy provides [C] energy. (Doesn\'t count as a basic Energy card.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this) {
            if ((0, prefabs_1.IS_SPECIAL_ENERGY_BLOCKED)(store, state, effect.player, this, effect.target)) {
                return state;
            }
            effect.target.removeSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
            effect.target.removeSpecialCondition(card_types_1.SpecialCondition.PARALYZED);
            effect.target.removeSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
            effect.target.removeSpecialCondition(card_types_1.SpecialCondition.POISONED);
        }
        return state;
    }
}
exports.FullHealEnergy = FullHealEnergy;
