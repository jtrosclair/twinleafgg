"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarniesMorpeko = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MarniesMorpeko extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.MARNIES];
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Spiky Wheel',
                cost: [C, C, C],
                damage: 20,
                damageCalculation: '+',
                text: 'This attack does 40 more damage for each [D] Energy attached to this Pokémon.'
            }];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '137';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Marnie\'s Morpeko';
        this.fullName = 'Marnie\'s Morpeko DRI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                energyCount += em.provides.filter(cardType => cardType === game_1.CardType.DARK || cardType === game_1.CardType.ANY).length;
            });
            effect.damage += energyCount * 40;
        }
        return state;
    }
}
exports.MarniesMorpeko = MarniesMorpeko;
