"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolonEnergyFF = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class HolonEnergyFF extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'DS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '104';
        this.name = 'Holon Energy FF';
        this.fullName = 'Holon Energy FF DS';
        this.text = 'Holon Energy FF provides [C] Energy.' +
            '\n\n' +
            'If the Pokémon that Holon Energy FF is attached to also has a basic [R] Energy card attached to it, that Pokémon has no Weakness. If the Pokémon that Holon Energy FF is attached to also has a basic [F] Energy card attached to it, damage done by that Pokémon\'s attack isn\'t affected by Resistance. Ignore these effects if Holon Energy FF is attached to Pokémon-ex.';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof game_effects_1.AttackEffect
            && effect.target
            && effect.target.cards.includes(this)
            && !effect.target.tags.includes(card_types_1.CardTag.POKEMON_ex)
            && !prefabs_1.IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.opponent, this, effect.target)) {
            console.log('Holon Energy FF effect');
            if (effect.target.energies.cards.some((card) => card.energyType === card_types_1.EnergyType.BASIC && card.name === 'Fire Energy')) {
                console.log('Holon Energy FF effect & fire energy detected');
                effect.ignoreWeakness = true;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect
            && effect.source
            && effect.source.cards.includes(this)
            && !((_a = effect.source.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_ex))
            && !prefabs_1.IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.player, this, effect.source)) {
            if (effect.source.energies.cards.some((card) => card.energyType === card_types_1.EnergyType.BASIC && card.name === 'Fighting Energy')) {
                effect.ignoreResistance = true;
            }
        }
        if (effect instanceof check_effects_1.CheckPokemonStatsEffect
            && effect.target.cards.includes(this)
            && effect.target.energies.cards.some((card) => card.energyType === card_types_1.EnergyType.BASIC && card.name === 'Fire Energy')) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (!prefabs_1.IS_SPECIAL_ENERGY_BLOCKED(store, state, opponent, this, effect.target)) {
                const target = effect.target.getPokemonCard();
                if (target) {
                    effect.weakness = [];
                }
            }
        }
        return state;
    }
}
exports.HolonEnergyFF = HolonEnergyFF;
