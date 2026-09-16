"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeatRotom = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class HeatRotom extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 80;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Singe',
                cost: [R],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Burned.'
            }, {
                name: 'Gadget Show',
                cost: [C, C],
                damage: 30,
                damageCalculation: 'x',
                text: 'This attack does 30 damage for each Pokémon Tool attached to all of your Pokémon.',
            }];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '43';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Heat Rotom';
        this.fullName = 'Heat Rotom DRI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED)(store, state, effect);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            let toolCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                toolCount += cardList.tools.length;
            });
            effect.damage = 30 * toolCount;
        }
        return state;
    }
}
exports.HeatRotom = HeatRotom;
