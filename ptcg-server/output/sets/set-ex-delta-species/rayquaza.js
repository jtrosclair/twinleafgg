"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rayquaza = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Rayquaza extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = L;
        this.additionalCardTypes = [M];
        this.hp = 90;
        this.weakness = [{ type: C }];
        this.resistance = [{ type: W, value: -30 }, { type: F, value: -30 }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Delta Guard',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as Rayquaza has any Holon Energy cards attached to it, ignore the effect of Rayquaza\'s Lightning Storm attack.'
            }];
        this.attacks = [{
                name: 'Power Blow',
                cost: [L],
                damage: 10,
                damageCalculation: 'x',
                text: 'Does 10 damage times the amount of Energy attached to Rayquaza.'
            },
            {
                name: 'Lightning Storm',
                cost: [L, M, C, C],
                damage: 70,
                text: 'Put 7 damage counters on Rayquaza.'
            }];
        this.set = 'DS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '13';
        this.name = 'Rayquaza';
        this.fullName = 'Rayquaza DS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.getPokemonCard() === this) {
                    const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
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
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const energies = player.active.cards.filter(card => card.superType === card_types_1.SuperType.ENERGY && card.name.includes('Holon Energy'));
            if (energies.length === 0) {
                player.active.damage += 70;
            }
        }
        return state;
    }
}
exports.Rayquaza = Rayquaza;
