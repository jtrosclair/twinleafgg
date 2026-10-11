"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zekrom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Zekrom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 130;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Slash',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            },
            {
                name: 'Nitro Thunder',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 80,
                damageCalculation: '+',
                text: 'If this Pokémon has any [R] Energy attached, this attack does 80 more damage.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '56';
        this.name = 'Zekrom';
        this.fullName = 'Zekrom 30C';
    }
    reduceEffect(store, state, effect) {
        // Nitro Thunder
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkEnergy);
            const hasFire = checkEnergy.energyMap.some(em => em.provides.some(t => t === card_types_1.CardType.FIRE || t === card_types_1.CardType.ANY));
            if (hasFire) {
                effect.damage += 80;
            }
        }
        return state;
    }
}
exports.Zekrom = Zekrom;
