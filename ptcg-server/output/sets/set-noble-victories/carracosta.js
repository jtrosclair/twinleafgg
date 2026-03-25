"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Carracosta = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const state_utils_1 = require("../../game/store/state-utils");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Carracosta extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Tirtouga';
        this.cardType = W;
        this.hp = 140;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Solid Rock',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Any damage done to this Pokémon by attacks is reduced by 20 (after applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Hydro Pump',
                cost: [W, W, C],
                damage: 60,
                damageCalculation: '+',
                text: 'Does 10 more damage for each [W] Energy attached to this Pokémon.'
            }];
        this.set = 'NVI';
        this.setNumber = '26';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Carracosta';
        this.fullName = 'Carracosta NVI';
    }
    reduceEffect(store, state, effect) {
        // Solid Rock - reduce damage taken by 20
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.cards.includes(this)) {
            const player = state_utils_1.StateUtils.findOwner(state, effect.target);
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            effect.damage = Math.max(0, effect.damage - 20);
        }
        // Hydro Pump - +10 per Water Energy
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, checkEnergy);
            let waterEnergy = 0;
            checkEnergy.energyMap.forEach(em => {
                waterEnergy += em.provides.filter(p => p === card_types_1.CardType.WATER).length;
            });
            effect.damage += 10 * waterEnergy;
        }
        return state;
    }
}
exports.Carracosta = Carracosta;
