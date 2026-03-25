"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hoppip = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
class Hoppip extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 30;
        this.weakness = [{ type: R, value: +10 }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Cottonweed',
                powerType: game_1.PowerType.POKEBODY,
                text: 'If Hoppip has any [G] Energy attached to it, the Retreat Cost for Hoppip is 0.'
            }];
        this.attacks = [{
                name: 'Hover Heal',
                cost: [G],
                damage: 10,
                text: 'Remove all Special Conditions from Hoppip.'
            }];
        this.set = 'SW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '90';
        this.name = 'Hoppip';
        this.fullName = 'Hoppip SW';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.getPokemonCard() === this) {
            const player = effect.player;
            const pokemonCard = player.active.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            // Check if there is any Water energy attached
            const hasGrassEnergy = checkProvidedEnergy.energyMap.some(energy => energy.provides.includes(card_types_1.CardType.GRASS) || energy.provides.includes(card_types_1.CardType.ANY));
            if (hasGrassEnergy) {
                effect.cost = [];
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const conditions = player.active.specialConditions.slice();
            conditions.forEach((condition) => {
                player.active.removeSpecialCondition(condition);
            });
        }
        return state;
    }
}
exports.Hoppip = Hoppip;
