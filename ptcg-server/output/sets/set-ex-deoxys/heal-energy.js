"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class HealEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'DX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '94';
        this.name = 'Heal Energy';
        this.fullName = 'Heal Energy DX';
        this.text = 'Heal Energy provides [C] Energy. When you attach this card from your hand to 1 of your Pokémon, remove 1 damage counter and all Special Conditions from that Pokémon. If Heal Energy is attached to Pokémon-ex, Heal Energy has no effect other than providing Energy.';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this) {
            const player = effect.player;
            if (prefabs_1.IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.player, this, effect.target)) {
                return state;
            }
            if ((_a = effect.target.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                return state;
            }
            const healEffect = new game_effects_1.HealEffect(player, effect.target, 10);
            store.reduceEffect(state, healEffect);
            effect.target.removeSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
            effect.target.removeSpecialCondition(card_types_1.SpecialCondition.PARALYZED);
            effect.target.removeSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
            effect.target.removeSpecialCondition(card_types_1.SpecialCondition.BURNED);
            effect.target.removeSpecialCondition(card_types_1.SpecialCondition.POISONED);
        }
        return state;
    }
}
exports.HealEnergy = HealEnergy;
