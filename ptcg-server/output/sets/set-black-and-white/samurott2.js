"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Samurott2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Samurott2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Dewott';
        this.cardType = W;
        this.hp = 140;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Shell Armor',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Any damage done to this Pokémon by attacks is reduced by 20 (after applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Hydro Pump',
                cost: [C, C, C],
                damage: 70,
                damageCalculation: '+',
                text: 'Does 10 more damage for each [W] Energy attached to this Pokémon.'
            }];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '32';
        this.name = 'Samurott';
        this.fullName = 'Samurott BLW 32';
    }
    reduceEffect(store, state, effect) {
        // Hydro Pump - Extra damage for Water Energy
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                energyCount += em.provides.filter(cardType => {
                    return cardType === card_types_1.CardType.WATER || cardType === card_types_1.CardType.ANY;
                }).length;
            });
            effect.damage += energyCount * 10;
        }
        // Shell Armor - Reduce damage from attacks
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.cards.includes(this)) {
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
            // Check if ability is blocked
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            effect.damage = Math.max(0, effect.damage - 20);
        }
        return state;
    }
}
exports.Samurott2 = Samurott2;
