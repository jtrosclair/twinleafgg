"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kyogre = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Kyogre extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 140;
        this.cardType = card_types_1.CardType.WATER;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Hydro Pump',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 60,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each [W] Energy attached to this Pokémon.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '19';
        this.name = 'Kyogre';
        this.fullName = 'Kyogre 30C';
    }
    reduceEffect(store, state, effect) {
        // Hydro Pump
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(effect.player);
            store.reduceEffect(state, checkEnergy);
            const waterCount = checkEnergy.energyMap.reduce((sum, em) => sum + em.provides.filter(t => t === card_types_1.CardType.WATER || t === card_types_1.CardType.ANY).length, 0);
            effect.damage += waterCount * 30;
        }
        return state;
    }
}
exports.Kyogre = Kyogre;
