"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wartortle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Wartortle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Squirtle';
        this.cardType = W;
        this.hp = 80;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Water Gun',
                cost: [W],
                damage: 20,
                damageCalculation: '+',
                text: 'Does 20 damage plus 10 more damage for each [W] Energy attached to Wartortle but not used to pay for this attack\'s Energy cost. You can\'t add more than 20 damage in this way.'
            },
            {
                name: 'Smash Turn',
                cost: [W, C, C],
                damage: 40,
                text: 'After your attack, you may switch Wartortle with 1 of your Benched Pokémon.'
            }
        ];
        this.set = 'RG';
        this.name = 'Wartortle';
        this.fullName = 'Wartortle RG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '50';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Check attack cost
            const checkCost = new check_effects_1.CheckAttackCostEffect(player, this.attacks[0]);
            state = store.reduceEffect(state, checkCost);
            // Check attached energy
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkEnergy);
            // Filter for only Water Energy
            const waterEnergy = checkEnergy.energyMap.filter(e => e.provides.includes(card_types_1.CardType.WATER));
            // Get number of extra Water energy  
            const extraWaterEnergy = waterEnergy.length - checkCost.cost.length;
            // Apply damage boost based on extra Water energy
            if (extraWaterEnergy == 1)
                effect.damage += 10;
            if (extraWaterEnergy == 2)
                effect.damage += 20;
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            const player = effect.player;
            (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, player);
        }
        return state;
    }
}
exports.Wartortle = Wartortle;
