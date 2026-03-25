"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Diancie = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Diancie extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 110;
        this.weakness = [{ type: G }];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Diffuse Reflection',
                cost: [C],
                damage: 40,
                damageCalculation: 'x',
                text: 'This attack does 40 damage for each Special Energy attached to all of your opponent\'s Pokémon.',
            }, {
                name: 'Power Gem',
                cost: [F, C],
                damage: 60,
                text: ''
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '86';
        this.name = 'Diancie';
        this.fullName = 'Diancie SCR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let specialEnergyCount = 0;
            // Count special energy on all opponent's Pokemon
            opponent.bench.concat([opponent.active]).forEach(pokemon => {
                if (pokemon) {
                    pokemon.cards.forEach(card => {
                        if (card.superType === game_1.SuperType.ENERGY && card.energyType === game_1.EnergyType.SPECIAL) {
                            specialEnergyCount++;
                        }
                    });
                }
            });
            effect.damage = 40 * specialEnergyCount;
        }
        return state;
    }
}
exports.Diancie = Diancie;
