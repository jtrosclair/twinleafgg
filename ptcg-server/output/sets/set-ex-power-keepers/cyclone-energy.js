"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CycloneEnergy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class CycloneEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'PK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '90';
        this.name = 'Cyclone Energy';
        this.fullName = 'Cyclone Energy PK';
        this.text = 'Cyclone Energy provides [C] Energy. When you attach this card from your hand to your Active Pokémon, switch 1 of the Defending Pokémon with 1 of your opponent\'s Benched Pokémon. Your opponent chooses the Benched Pokémon to switch.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this && effect.target === effect.player.active) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (prefabs_1.IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.player, this, effect.target)) {
                return state;
            }
            prefabs_1.SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent);
        }
        return state;
    }
}
exports.CycloneEnergy = CycloneEnergy;
