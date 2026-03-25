"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolonEnergyWP = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const attack_effects_2 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class HolonEnergyWP extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '86';
        this.name = 'Holon Energy WP';
        this.fullName = 'Holon Energy WP DF';
        this.text = 'Holon Energy WP provides [C] Energy.' +
            '\n\n' +
            'If the Pokémon that Holon Energy WP is attached to also has a basic [W] Energy card attached to it, prevent all effects of attacks, excluding damage, done to that Pokémon by your opponent\'s Pokémon. If the Pokémon that Holon Energy WP is attached to also has a basic [P] Energy card attached to it, that Pokémon\'s Retreat Cost is 0. Ignore these effects if Holon Energy WP is attached to Pokémon-ex.';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof game_effects_1.AttackEffect
            && effect.target
            && effect.target.cards.includes(this)
            && !effect.target.tags.includes(card_types_1.CardTag.POKEMON_ex)
            && !(0, prefabs_1.IS_SPECIAL_ENERGY_BLOCKED)(store, state, effect.opponent, this, effect.target)) {
            if (effect.target.energies.cards.some((card) => card.energyType === card_types_1.EnergyType.BASIC && card.name === 'Water Energy')) {
                // Allow Weakness & Resistance
                if (effect instanceof attack_effects_1.ApplyWeaknessEffect) {
                    return state;
                }
                // Allow damage
                if (effect instanceof attack_effects_2.PutDamageEffect) {
                    return state;
                }
                if (effect instanceof attack_effects_2.DealDamageEffect) {
                    return state;
                }
                effect.preventDefault = true;
            }
        }
        if (effect instanceof check_effects_1.CheckRetreatCostEffect
            && effect.player.active.cards.includes(this)
            && !((_a = effect.player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_ex))
            && effect.player.active.energies.cards.some((card) => card.energyType === card_types_1.EnergyType.BASIC && card.name === 'Psychic Energy')) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (!(0, prefabs_1.IS_SPECIAL_ENERGY_BLOCKED)(store, state, opponent, this, effect.player.active)) {
                effect.cost = [];
            }
        }
        return state;
    }
}
exports.HolonEnergyWP = HolonEnergyWP;
