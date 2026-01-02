"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Goodra = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Goodra extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.cardType = N;
        this.hp = 160;
        this.weakness = [{ type: Y }];
        this.retreat = [C, C, C];
        this.evolvesFrom = 'Sliggoo';
        this.powers = [{
                name: 'Hydration',
                powerType: game_1.PowerType.ABILITY,
                text: 'Whenever you attach a [W] Energy card from your hand to this Pokémon, heal 20 damage from it.'
            }];
        this.attacks = [{
                name: 'Soaking Horn',
                cost: [W, Y, C],
                damage: 80,
                damageCalculation: '+',
                text: 'If this Pokémon was healed during this turn, this attack does 80 more damage.'
            }];
        this.set = 'FLI';
        this.name = 'Goodra';
        this.fullName = 'Goodra FLI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '94';
        this.HYDRATION_MARKER = 'HYDRATION_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Hydration
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.target.getPokemonCard() === this) {
            if (prefabs_1.IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
                return state;
            }
            if (effect.energyCard.energyType === card_types_1.EnergyType.BASIC && effect.energyCard.provides.includes(card_types_1.CardType.WATER)) {
                const healEffect = new game_effects_1.HealEffect(effect.player, effect.target, 20);
                return store.reduceEffect(state, healEffect);
            }
            // Check special energies that provide [W]
            if (effect.energyCard.energyType === card_types_1.EnergyType.SPECIAL) {
                // Temporarily push the energy card to the list of cards to check if it provides [W]
                effect.target.cards.push(effect.energyCard);
                const checkWaterEnergy = new check_effects_1.CheckProvidedEnergyEffect(effect.player, effect.target);
                store.reduceEffect(state, checkWaterEnergy);
                effect.target.cards.pop();
                const energyMap = checkWaterEnergy.energyMap.find(element => element.card === effect.energyCard);
                const providedEnergy = energyMap === null || energyMap === void 0 ? void 0 : energyMap.provides;
                if ((providedEnergy === null || providedEnergy === void 0 ? void 0 : providedEnergy.includes(card_types_1.CardType.WATER))
                    || (providedEnergy === null || providedEnergy === void 0 ? void 0 : providedEnergy.includes(card_types_1.CardType.ANY))
                    || (providedEnergy === null || providedEnergy === void 0 ? void 0 : providedEnergy.includes(card_types_1.CardType.WLFM))
                    || (providedEnergy === null || providedEnergy === void 0 ? void 0 : providedEnergy.includes(card_types_1.CardType.GRW))) {
                    const healEffect = new game_effects_1.HealEffect(effect.player, effect.target, 20);
                    return store.reduceEffect(state, healEffect);
                }
            }
        }
        // Healed this turn tracker
        if (effect instanceof game_effects_1.HealEffect && effect.target.getPokemonCard() === this) {
            prefabs_1.ADD_MARKER(this.HYDRATION_MARKER, effect.player, this);
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this && prefabs_1.HAS_MARKER(this.HYDRATION_MARKER, effect.player, this)) {
            prefabs_1.REMOVE_MARKER(this.HYDRATION_MARKER, effect.player, this);
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.HYDRATION_MARKER, this);
        // Soaking Horn
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this) && prefabs_1.HAS_MARKER(this.HYDRATION_MARKER, effect.player, this)) {
            effect.damage += 80;
        }
        return state;
    }
}
exports.Goodra = Goodra;
