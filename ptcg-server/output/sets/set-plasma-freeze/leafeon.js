"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Leafeon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const state_utils_1 = require("../../game/store/state-utils");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Leafeon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = G;
        this.hp = 100;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Energy Crush',
                cost: [C],
                damage: 20,
                damageCalculation: 'x',
                text: 'Does 20 damage times the amount of Energy attached to all of your opponent\'s Pokémon.'
            },
            {
                name: 'Leaf Blade',
                cost: [G, C, C],
                damage: 60,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 more damage.'
            }];
        this.set = 'PLF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '11';
        this.name = 'Leafeon';
        this.fullName = 'Leafeon PLF';
    }
    reduceEffect(store, state, effect) {
        // Energy Crush
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            let energies = 0;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(opponent, cardList);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                checkProvidedEnergyEffect.energyMap.forEach(energy => {
                    energies++;
                });
            });
            effect.damage = energies * 20;
        }
        // Leaf Blade
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 20);
        }
        return state;
    }
}
exports.Leafeon = Leafeon;
