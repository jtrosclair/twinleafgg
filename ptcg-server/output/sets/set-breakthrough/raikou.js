"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Raikou = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Raikou extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 120;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Shining Body',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon has any [L] Energy attached to it, any damage done to this Pokémon by attacks is reduced by 20 (after applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Thunder Lance',
                cost: [C, C, C],
                damage: 50,
                damageCalculation: '+',
                text: 'This attack does 20 more damage for each [L] Energy attached to this Pokémon.'
            }];
        this.set = 'BKT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '55';
        this.name = 'Raikou';
        this.fullName = 'Raikou BKT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.getPokemonCard() === this) {
            const player = effect.player;
            const pokemonCard = player.active.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            if (prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
                return state;
            }
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            // Check if there is any Water energy attached
            const hasLightningEnergy = checkProvidedEnergy.energyMap.some(energy => energy.provides.includes(card_types_1.CardType.LIGHTNING) || energy.provides.includes(card_types_1.CardType.ANY));
            if (hasLightningEnergy) {
                effect.damage -= 20;
            }
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                energyCount += em.provides.filter(cardType => cardType === card_types_1.CardType.LIGHTNING || cardType === card_types_1.CardType.ANY).length;
            });
            effect.damage += energyCount * 20;
        }
        return state;
    }
}
exports.Raikou = Raikou;
