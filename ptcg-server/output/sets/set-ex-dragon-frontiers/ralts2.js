"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ralts2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Ralts2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 50;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Hypnosis',
                cost: [C],
                damage: 0,
                text: 'The Defending Pokémon is now Asleep.'
            },
            {
                name: 'Psychic Boom',
                cost: [P],
                damage: 10,
                damageCalculation: 'x',
                text: 'Does 10 damage times the amount of Energy attached to the Defending Pokémon.'
            }];
        this.set = 'DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '60';
        this.name = 'Ralts';
        this.fullName = 'Ralts DF 60';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
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
                    effect.damage = checkProvidedEnergy.energyMap.length * damagePerEnergy;
                }
            });
            return state;
        }
        return state;
    }
}
exports.Ralts2 = Ralts2;
