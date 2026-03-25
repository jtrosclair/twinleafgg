"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mudkip = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Mudkip extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 50;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Water Gun',
                cost: [C],
                damage: 10,
                damageCalculation: '+',
                text: 'Does 10 damage plus 10 more damage for each [W] Energy attached to Mudkip but not used to pay for this attack\'s Energy cost. You can\'t add more than 20 damage in this way.'
            }];
        this.set = 'DR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '65';
        this.name = 'Mudkip';
        this.fullName = 'Mudkip DR';
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
        return state;
    }
}
exports.Mudkip = Mudkip;
