"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarpEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class WarpEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'SLG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '70';
        this.name = 'Warp Energy';
        this.fullName = 'Warp Energy SLG';
        this.text = 'This card provides [C] Energy.' +
            '\n\n' +
            'When you attach this card from your hand to your Active Pokémon, switch that Pokémon with 1 of your Benched Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this) {
            const player = effect.player;
            if (effect.player.active !== effect.target
                || player.bench.length <= 0
                || prefabs_1.IS_SPECIAL_ENERGY_BLOCKED(store, state, player, this, effect.target)) {
                return state;
            }
            prefabs_1.SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
        }
        return state;
    }
}
exports.WarpEnergy = WarpEnergy;
