"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zamazenta = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Zamazenta extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Metal Shield',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon has any Energy attached, it takes 30 less damage from attacks (after applying Weakness and Resistance).'
            }];
        this.attacks = [
            {
                name: 'Retaliate',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 100,
                damageCalculation: '+',
                text: 'If any of your Pokémon were Knocked Out during your opponent\'s last turn, this attack does 120 more damage.'
            },
        ];
        this.set = 'CRZ';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '97';
        this.name = 'Zamazenta';
        this.fullName = 'Zamazenta CRZ';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.marker.hasMarker(marker_constants_1.MarkerConstants.REVENGE_MARKER)) {
                effect.damage += 120;
            }
            return state;
        }
        // Reduce damage by 30
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            // It's not this pokemon card
            if (pokemonCard !== this) {
                return state;
            }
            // It's not an attack
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            const player = game_1.StateUtils.findOwner(state, effect.target);
            // Try to reduce PowerEffect, to check if something is blocking our ability
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            // Check attached energy 
            // Check attached energy 
            const zamazentaCardList = game_1.StateUtils.findCardList(state, this);
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, zamazentaCardList);
            state = store.reduceEffect(state, checkProvidedEnergy);
            const hasAnyEnergy = checkProvidedEnergy.energyMap.length > 0;
            if (hasAnyEnergy) {
                effect.damage = Math.max(0, effect.damage - 30);
            }
            return state;
        }
        return state;
    }
}
exports.Zamazenta = Zamazenta;
