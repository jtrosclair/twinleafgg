"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AegislashEX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const state_utils_1 = require("../../game/store/state-utils");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class AegislashEX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.cardType = M;
        this.hp = 170;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Mighty Shield',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Prevent all damage done to this Pokémon by attacks from each of your opponent\'s Pokémon that has Special Energy attached to it.'
            }];
        this.attacks = [{
                name: 'Slash Blast',
                cost: [C, C, C],
                damage: 40,
                damageCalculation: '+',
                text: 'This attack does 20 more damage for each [M] Energy attached to this Pokémon.'
            }];
        this.set = 'PHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '65';
        this.name = 'Aegislash-EX';
        this.fullName = 'Aegislash-EX PHF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                energyCount += em.provides.filter(cardType => {
                    return cardType === card_types_1.CardType.METAL || cardType === card_types_1.CardType.ANY;
                }).length;
            });
            effect.damage += energyCount * 20;
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this) && state.phase === state_1.GamePhase.ATTACK) {
            const player = state_utils_1.StateUtils.findOwner(state, effect.target);
            const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
            const opponentPokemon = opponent.active;
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent, opponentPokemon);
            store.reduceEffect(state, checkEnergy);
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            checkEnergy.energyMap.forEach(em => {
                const energyCard = em.card;
                if (energyCard.superType === card_types_1.SuperType.ENERGY &&
                    energyCard.energyType === card_types_1.EnergyType.SPECIAL) {
                    if (effect instanceof attack_effects_1.PutDamageEffect
                        && opponent.active.cards.includes(energyCard)) {
                        effect.damage = 0;
                        return state;
                    }
                }
            });
        }
        return state;
    }
}
exports.AegislashEX = AegislashEX;
