"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolonEnergyGL = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class HolonEnergyGL extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '85';
        this.name = 'Holon Energy GL';
        this.fullName = 'Holon Energy GL DF';
        this.text = 'Holon Energy GL provides [C] Energy.' +
            '\n\n' +
            'If the Pokémon that Holon Energy GL is attached to also has a basic [G] Energy card attached to it, that Pokémon can\'t be affected by any Special Conditions. If the Pokémon that Holon Energy GL is attached to also has a basic[L] Energy card attached to it, damage done by your opponent\'s Pokémon-ex is reduced by 10. Ignore these effects if Holon Energy GL is attached to Pokémon-ex.';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            state.players.forEach(player => {
                var _a;
                const active = player.active;
                if (active.specialConditions.length === 0) {
                    return;
                }
                if ((_a = active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                    return;
                }
                if (active.cards.includes(this) && !(0, prefabs_1.IS_SPECIAL_ENERGY_BLOCKED)(store, state, player, this, active) && active.energies.cards.some((card) => card.energyType === card_types_1.EnergyType.BASIC && card.name === 'Grass Energy')) {
                    const conditions = active.specialConditions.slice();
                    conditions.forEach(condition => {
                        active.removeSpecialCondition(condition);
                    });
                }
            });
            return state;
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && ((_a = effect.source.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_ex))) {
            const damagedPlayer = game_1.StateUtils.findOwner(state, effect.target);
            let isEffectActive = false;
            damagedPlayer.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                var _a;
                if (isEffectActive || !cardList.cards.includes(this)) {
                    return;
                }
                if ((_a = cardList.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                    return;
                }
                const hasBasicLightning = cardList.energies.cards.some((card) => card.energyType === card_types_1.EnergyType.BASIC && card.name === 'Lightning Energy');
                if (!hasBasicLightning) {
                    return;
                }
                if ((0, prefabs_1.IS_SPECIAL_ENERGY_BLOCKED)(store, state, damagedPlayer, this, cardList)) {
                    return;
                }
                isEffectActive = true;
            });
            if (isEffectActive) {
                effect.damage -= 10;
            }
        }
        return state;
    }
}
exports.HolonEnergyGL = HolonEnergyGL;
