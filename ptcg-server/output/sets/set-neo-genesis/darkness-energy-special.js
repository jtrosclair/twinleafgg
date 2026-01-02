"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarknessEnergySpecial = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_1 = require("../../game");
class DarknessEnergySpecial extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.DARK];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'N1';
        this.name = 'Darkness Energy';
        this.fullName = 'Darkness Energy N1';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '104';
        this.text = 'If the Pokémon Darkness Energy is attached to damages the Defending Pokémon (after applying Weakness and Resistance), the attack does 10 more damage to the Defending Pokémon. At the end of every turn, put 1 damage counter on the Pokémon Darkness Energy is attached to, unless it\'s [D] or has Dark in its name.\n\nDarkness Energy provides [D] Energy. (Doesn\'t count as a basic Energy card.)';
    }
    reduceEffect(store, state, effect) {
        // Increase damage output
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.source.cards.includes(this)) {
            // must deal > 0 damage to active Pokémon
            // const target = effect.target;
            // if (effect.damage && effect.damage > 0 && (effect.target === effect.opponent.active || effect.target === effect.player.active)) {
            //   const additionalDamageEffect = new AfterWeaknessAndResistanceEffect(effect.attackEffect, 10);
            //   additionalDamageEffect.target = target;
            //   store.reduceEffect(state, additionalDamageEffect);
            // }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.forEachPokemon(game_1.PlayerType.ANY, (pokemon) => {
                var _a;
                if (pokemon.cards.includes(this)) {
                    const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(pokemon);
                    store.reduceEffect(state, checkPokemonType);
                    if (!checkPokemonType.cardTypes.includes(card_types_1.CardType.DARK) && !((_a = pokemon.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.DARK))) {
                        pokemon.damage += 10;
                    }
                }
            });
            opponent.forEachPokemon(game_1.PlayerType.ANY, (pokemon) => {
                var _a;
                if (pokemon.cards.includes(this)) {
                    const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(pokemon);
                    store.reduceEffect(state, checkPokemonType);
                    if (!checkPokemonType.cardTypes.includes(card_types_1.CardType.DARK) && !((_a = pokemon.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.DARK))) {
                        pokemon.damage += 10;
                    }
                }
            });
        }
        return state;
    }
}
exports.DarknessEnergySpecial = DarknessEnergySpecial;
