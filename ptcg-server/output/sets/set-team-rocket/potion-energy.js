"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PotionEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class PotionEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'TR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '82';
        this.name = 'Potion Energy';
        this.fullName = 'Potion Energy TR';
        this.text = 'If you play this card from your hand, remove 1 damage counter from the Pokémon you attach it to, if it has any.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this) {
            const player = effect.player;
            if (prefabs_1.IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.player, this, effect.target)) {
                return state;
            }
            if (effect.target.damage > 0) {
                const healEffect = new game_effects_1.HealEffect(player, effect.target, 10);
                store.reduceEffect(state, healEffect);
            }
        }
        return state;
    }
}
exports.PotionEnergy = PotionEnergy;
