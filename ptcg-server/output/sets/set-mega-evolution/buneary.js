"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buneary = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Buneary extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [{
                name: 'Charm',
                cost: [C],
                damage: 0,
                text: 'During your opponent\'s next turn, attacks used by the Defending Pokémon do 20 less damage (before applying Weakness and Resistance).'
            },
            {
                name: 'Skip',
                cost: [C],
                damage: 10,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'MEG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '107';
        this.name = 'Buneary';
        this.fullName = 'Buneary M1L';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.damageReductionNextTurn = 20;
        }
        return state;
    }
}
exports.Buneary = Buneary;
