"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaptureEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class CaptureEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'RCL';
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '171';
        this.name = 'Capture Energy';
        this.fullName = 'Capture Energy RCL';
        this.text = `This card provides [C] Energy.
    
When you attach this card from your hand to a Pokémon, search your deck for a Basic Pokémon and put it onto your Bench. Then, shuffle your deck.`;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this) {
            const player = effect.player;
            if ((0, prefabs_1.IS_SPECIAL_ENERGY_BLOCKED)(store, state, player, this, effect.target)) {
                return state;
            }
            if ((0, prefabs_1.GET_PLAYER_BENCH_SLOTS)(player).length === 0) {
                return state;
            }
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, player, { stage: card_types_1.Stage.BASIC }, { min: 0, max: 1 });
        }
        return state;
    }
}
exports.CaptureEnergy = CaptureEnergy;
