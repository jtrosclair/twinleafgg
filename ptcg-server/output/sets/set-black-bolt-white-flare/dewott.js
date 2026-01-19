"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dewott = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dewott extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Oshawott';
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Energy Shell',
                cost: [W],
                damage: 30,
                damageCalculation: 'x',
                text: 'This attack does 30 damage for each Energy attached to this Pokémon.'
            }];
        this.regulationMark = 'I';
        this.set = 'WHT';
        this.setNumber = '22';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dewott';
        this.fullName = 'Dewott SV11W';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const cardList = player.active;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
            store.reduceEffect(state, checkProvidedEnergy);
            const energyCount = checkProvidedEnergy.energyMap.length;
            effect.damage = 30 * energyCount;
        }
        return state;
    }
}
exports.Dewott = Dewott;
