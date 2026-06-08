"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagnetMetalEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MagnetMetalEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.METAL];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'M4';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '83';
        this.usSetNumber = 'POR 83';
        this.name = 'Magnet Metal Energy';
        this.fullName = 'Magnet Metal Energy M4';
        this.text = 'As long as this card is attached to a Pokemon, it provides [M] Energy. As long as this card is attached to a [M] Pokémon, that Pokemon has no Retreat Cost.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            try {
                const energyEffect = new play_card_effects_1.EnergyEffect(effect.player, this);
                store.reduceEffect(state, energyEffect);
            }
            catch (_a) {
                return state;
            }
            effect.energyMap.push({ card: this, provides: [card_types_1.CardType.METAL] });
        }
        if (effect instanceof check_effects_1.CheckRetreatCostEffect) {
            const player = effect.player;
            const hasThisEnergy = player.active.cards.includes(this) || player.active.energies.cards.includes(this);
            if (!hasThisEnergy) {
                return state;
            }
            if ((0, prefabs_1.IS_SPECIAL_ENERGY_BLOCKED)(store, state, player, this, player.active)) {
                return state;
            }
            const checkType = new check_effects_1.CheckPokemonTypeEffect(player.active);
            store.reduceEffect(state, checkType);
            if (checkType.cardTypes.includes(card_types_1.CardType.METAL)) {
                effect.cost = [];
            }
        }
        return state;
    }
}
exports.MagnetMetalEnergy = MagnetMetalEnergy;
