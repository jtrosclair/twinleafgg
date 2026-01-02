"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seadra = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Seadra extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Horsea';
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Wave Splash',
                cost: [W],
                damage: 20,
                text: ''
            },
            {
                name: 'Water Bullet',
                cost: [C, C, C],
                damage: 30,
                damageCalculation: '+',
                text: 'Flip a number of coins equal to the number of [W] Energy attached to Seadra. This attack does 30 damage plus 10 more damage for each heads.'
            }];
        this.set = 'AQ';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '58';
        this.name = 'Seadra';
        this.fullName = 'Seadra AQ';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            // Count only energies that provide [W]
            let waterEnergyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                if (em.provides.includes(card_types_1.CardType.WATER) || em.provides.includes(card_types_1.CardType.ANY)) {
                    waterEnergyCount++;
                }
            });
            for (let i = 0; i < waterEnergyCount; i++) {
                prefabs_1.COIN_FLIP_PROMPT(store, state, player, result => {
                    if (result) {
                        effect.damage += 10;
                    }
                });
            }
        }
        return state;
    }
}
exports.Seadra = Seadra;
