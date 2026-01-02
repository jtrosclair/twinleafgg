"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpperEnergy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
class UpperEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'RR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '102';
        this.name = 'Upper Energy';
        this.fullName = 'Upper Energy RR';
        this.text = 'Upper Energy provides [C] Energy. If you have more Prize cards left than your opponent and this card is attached to a Pokémon (excluding Pokémon LV.X), Upper Energy provides [C][C].';
    }
    reduceEffect(store, state, effect) {
        var _a;
        // Provide energy 
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this) && !((_a = effect.source.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_LV_X))) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const provides = player.getPrizeLeft() > opponent.getPrizeLeft() ? [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS] : [card_types_1.CardType.COLORLESS];
            effect.energyMap.push({ card: this, provides });
            return state;
        }
        return state;
    }
}
exports.UpperEnergy = UpperEnergy;
