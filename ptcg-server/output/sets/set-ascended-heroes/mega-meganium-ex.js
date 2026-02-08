"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaMeganiumex = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegaMeganiumex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Bayleef';
        this.tags = [game_1.CardTag.POKEMON_SV_MEGA, game_1.CardTag.POKEMON_ex];
        this.cardType = G;
        this.hp = 360;
        this.weakness = [{ type: R }];
        this.resistance = [];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Giant Bouquet',
                cost: [C, C, C],
                damage: 70,
                damageCalculation: '+',
                text: 'This attack does 50 more damage for each [G] Energy attached to this Pokémon.'
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '10';
        this.name = 'Mega Meganium ex';
        this.fullName = 'Mega Meganium ex MC';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let grassEnergyCount = 0;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            grassEnergyCount = checkProvidedEnergy.energyMap.reduce((sum, energy) => {
                return sum + energy.provides.filter(type => type === game_1.CardType.GRASS || type === game_1.CardType.ANY).length;
            }, 0);
            effect.damage = 70 + (50 * grassEnergyCount);
        }
        return state;
    }
}
exports.MegaMeganiumex = MegaMeganiumex;
