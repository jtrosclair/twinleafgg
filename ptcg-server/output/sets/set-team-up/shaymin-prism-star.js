"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShayminPrismStar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class ShayminPrismStar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.PRISM_STAR];
        this.cardType = G;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.retreat = [];
        this.attacks = [{
                name: 'Flower Storm',
                cost: [G, G],
                damage: 30,
                damageCalculation: 'x',
                text: 'This attack does 30 damage times the amount of basic Energy attached to all of your Pokémon.'
            }];
        this.set = 'TEU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '10';
        this.name = 'Shaymin Prism Star';
        this.fullName = 'Shaymin Prism Star TEU';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            let energyCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, pokemon => {
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, pokemon);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                checkProvidedEnergyEffect.energyMap.forEach(em => {
                    if (em.card.energyType === card_types_1.EnergyType.BASIC && em.provides.length > 0) {
                        energyCount += em.provides.length;
                    }
                });
            });
            // Set the damage based on the total count of basic energy
            effect.damage = 30 * energyCount;
            return state;
        }
        return state;
    }
}
exports.ShayminPrismStar = ShayminPrismStar;
