"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cetitan = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Cetitan extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Cetoddle';
        this.regulationMark = 'G';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 180;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Icicle Missile',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            },
            {
                name: 'Special Horn',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 80,
                damageCalculation: '+',
                text: 'If this Pokémon has any Special Energy attached, this attack does 140 more damage.'
            }
        ];
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '55';
        this.name = 'Cetitan';
        this.fullName = 'Cetitan PAL';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const pokemon = player.active;
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, pokemon);
            store.reduceEffect(state, checkEnergy);
            const hasSpecialEnergy = checkEnergy.energyMap.some(em => {
                const energyCard = em.card;
                return energyCard instanceof game_1.EnergyCard && energyCard.energyType === card_types_1.EnergyType.SPECIAL;
            });
            if (hasSpecialEnergy) {
                effect.damage += 140;
            }
        }
        return state;
    }
}
exports.Cetitan = Cetitan;
