"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wailmer = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Wailmer extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 80;
        this.weakness = [{ type: L }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Rest',
                cost: [C],
                damage: 0,
                text: 'Remove all Special Conditions and 4 damage counters from Wailmer (all if there are less than 4). Wailmer is now Asleep.'
            },
            {
                name: 'Water Gun',
                cost: [W, C],
                damage: 20,
                damageCalculation: '+',
                text: 'This attack does 20 damage plus 10 more damage for each [W] Energy attached to Wailmer but not used to pay for this attack\'s Energy cost. You can\'t add more than 20 damage in this way.'
            }];
        this.set = 'RS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '48';
        this.name = 'Wailmer';
        this.fullName = 'Wailmer RS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const conditions = player.active.specialConditions.slice();
            conditions.forEach((condition) => {
                player.active.removeSpecialCondition(condition);
            });
            (0, prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect, store, state, 40);
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, player, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            // Check attack cost
            const checkCost = new check_effects_1.CheckAttackCostEffect(player, this.attacks[1]);
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
exports.Wailmer = Wailmer;
