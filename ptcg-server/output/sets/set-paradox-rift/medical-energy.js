"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MedicalEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '182';
        this.name = 'Medical Energy';
        this.fullName = 'Medical Energy PAR';
        this.regulationMark = 'G';
        this.text = 'As long as this card is attached to a Pokémon, it provides [C] Energy.\n\nWhen you attach this card from your hand to 1 of your Pokémon, heal 30 damage from that Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this) {
            const player = effect.player;
            if ((0, prefabs_1.IS_SPECIAL_ENERGY_BLOCKED)(store, state, effect.player, this, effect.target)) {
                return state;
            }
            const healEffect = new game_effects_1.HealEffect(player, effect.target, 30);
            store.reduceEffect(state, healEffect);
        }
        return state;
    }
}
exports.MedicalEnergy = MedicalEnergy;
