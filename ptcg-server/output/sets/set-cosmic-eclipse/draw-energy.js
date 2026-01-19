"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class DrawEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '209';
        this.name = 'Draw Energy';
        this.fullName = 'Draw Energy CEC';
        this.text = 'This card provides [C] Energy.' +
            '\n\n' +
            'When you attach this card from your hand to a Pokémon, draw a card.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this) {
            const player = effect.player;
            if ((0, prefabs_1.IS_SPECIAL_ENERGY_BLOCKED)(store, state, player, this, effect.target)) {
                return state;
            }
            (0, prefabs_1.DRAW_CARDS)(player, 1);
        }
        return state;
    }
}
exports.DrawEnergy = DrawEnergy;
