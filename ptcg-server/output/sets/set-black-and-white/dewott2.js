"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dewott2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Dewott2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Oshawott';
        this.cardType = W;
        this.hp = 80;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Aqua Tail',
                cost: [C, C],
                damage: 30,
                damageCalculation: '+',
                text: 'Flip a coin for each [W] Energy attached to this Pokémon. This attack does 10 more damage for each heads.'
            }];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '30';
        this.name = 'Dewott';
        this.fullName = 'Dewott BLW 30';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, checkEnergy);
            let waterEnergyCount = 0;
            checkEnergy.energyMap.forEach(em => {
                waterEnergyCount += em.provides.filter(p => p === card_types_1.CardType.WATER).length;
            });
            if (waterEnergyCount > 0) {
                (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, waterEnergyCount, results => {
                    const heads = results.filter(r => r).length;
                    effect.damage += 10 * heads;
                });
            }
        }
        return state;
    }
}
exports.Dewott2 = Dewott2;
