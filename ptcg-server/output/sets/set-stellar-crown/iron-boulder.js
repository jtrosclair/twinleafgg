"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IronBoulder = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class IronBoulder extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 140;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Adjusted Horn',
                cost: [P, C],
                damage: 170,
                text: 'If you don\'t have the same number of cards in your hand as your opponent, this attack does nothing.'
            }];
        this.regulationMark = 'H';
        this.set = 'SCR';
        this.name = 'Iron Boulder';
        this.fullName = 'Iron Boulder SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.hand.cards.length !== opponent.hand.cards.length) {
                effect.damage = 0;
            }
        }
        return state;
    }
}
exports.IronBoulder = IronBoulder;
