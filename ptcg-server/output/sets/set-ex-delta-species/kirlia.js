"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kirlia = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Kirlia extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Ralts';
        this.hp = 70;
        this.cardType = P;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Calm Mind',
                cost: [C],
                damage: 0,
                text: 'Remove 3 damage counters from Kirlia.'
            },
            {
                name: 'Psychic Boom',
                cost: [P, C],
                damage: 20,
                damageCalculation: '+',
                text: 'Does 20 damage plus 10 more damage for each Energy attached to the Defending Pokémon.'
            }];
        this.set = 'DS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '47';
        this.name = 'Kirlia';
        this.fullName = 'Kirlia DS';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 30);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const opponent = effect.opponent;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList === opponent.active) {
                    const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent, cardList);
                    store.reduceEffect(state, checkProvidedEnergy);
                    const blockedCards = [];
                    checkProvidedEnergy.energyMap.forEach(em => {
                        if (!em.provides.includes(card_types_1.CardType.ANY)) {
                            blockedCards.push(em.card);
                        }
                    });
                    const damagePerEnergy = 10;
                    effect.damage += checkProvidedEnergy.energyMap.length * damagePerEnergy;
                }
            });
        }
        return state;
    }
}
exports.Kirlia = Kirlia;
