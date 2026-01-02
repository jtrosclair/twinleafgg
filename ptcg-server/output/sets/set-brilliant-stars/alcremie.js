"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alcremie = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Alcremie extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'E';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Milcery';
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.powers = [{
                name: 'Additional Order',
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is in the Active Spot, your turn does not end when you use Café Master.'
            }];
        this.attacks = [{
                name: 'Rainbow Flavor',
                cost: [C, C],
                damage: 10,
                damageCalculation: '+',
                text: 'This attack does 40 more damage for each type of basic Energy attached to all of your Pokémon.'
            }];
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
        this.name = 'Alcremie';
        this.fullName = 'Alcremie BRS';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const uniqueTypes = new Set();
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, pokemon => {
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, pokemon);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                checkProvidedEnergyEffect.energyMap.forEach(em => {
                    if (em.card.energyType === card_types_1.EnergyType.BASIC && em.provides.length > 0) {
                        if (em.provides.includes(card_types_1.CardType.ANY)) {
                            // Add all basic energy types if CardType.ANY is provided
                            [
                                card_types_1.CardType.FIRE,
                                card_types_1.CardType.WATER,
                                card_types_1.CardType.GRASS,
                                card_types_1.CardType.LIGHTNING,
                                card_types_1.CardType.PSYCHIC,
                                card_types_1.CardType.FIGHTING,
                                card_types_1.CardType.DARK,
                                card_types_1.CardType.METAL,
                                card_types_1.CardType.FAIRY
                            ].forEach(type => uniqueTypes.add(type));
                        }
                        else {
                            em.provides.forEach(type => uniqueTypes.add(type));
                        }
                    }
                });
            });
            // Set the damage based on the count of unique Pokémon types
            effect.damage += 40 * uniqueTypes.size;
            return state;
        }
        return state;
    }
}
exports.Alcremie = Alcremie;
