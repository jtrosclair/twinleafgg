"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deino = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Deino extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Stomp Off',
                cost: [D],
                damage: 0,
                text: 'Discard the top card of your opponent\'s deck.'
            },
            {
                name: 'Bite',
                cost: [D, C],
                damage: 20,
                text: ''
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SSP';
        this.setNumber = '117';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Deino';
        this.fullName = 'Deino SSP';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.MOVE_CARDS)(store, state, opponent.deck, opponent.discard, { count: 1, sourceCard: this, sourceEffect: this.attacks[0] });
        }
        return state;
    }
}
exports.Deino = Deino;
