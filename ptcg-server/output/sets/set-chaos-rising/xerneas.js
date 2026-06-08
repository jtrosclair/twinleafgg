"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Xerneas = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Xerneas extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 130;
        this.weakness = [{ type: M }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Geostorm',
                cost: [P, P, P],
                damage: 0,
                damageCalculation: 'x',
                text: 'This attack does 30 damage times the number of [P] Energy attached to all of your Pokemon.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '42';
        this.usSetNumber = 'CRI 42';
        this.name = 'Xerneas';
        this.fullName = 'Xerneas M4';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let psychicEnergyCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkEnergy);
                checkEnergy.energyMap.forEach(em => {
                    em.provides.forEach(t => {
                        if (t === card_types_1.CardType.PSYCHIC || t === card_types_1.CardType.ANY) {
                            psychicEnergyCount++;
                        }
                    });
                });
            });
            effect.damage = 30 * psychicEnergyCount;
        }
        return state;
    }
}
exports.Xerneas = Xerneas;
