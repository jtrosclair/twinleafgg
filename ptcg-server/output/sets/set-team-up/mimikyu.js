"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mimikyu = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Mimikyu extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = Y;
        this.hp = 70;
        this.weakness = [];
        this.retreat = [C];
        this.attacks = [{
                name: 'Filch',
                cost: [C],
                damage: 0,
                text: 'Draw 2 cards.'
            }, {
                name: 'Copycat',
                cost: [Y, C],
                damage: 0,
                copycatAttack: true,
                text: 'If your opponent\'s Pokémon used an attack that isn\'t a GX attack during their last turn, use it as this attack.'
            }];
        this.set = 'TEU';
        this.name = 'Mimikyu';
        this.fullName = 'Mimikyu TEU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '112';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.deck.moveTo(player.hand, 2);
            return state;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            return (0, prefabs_1.COPY_OPPONENTS_LAST_ATTACK)(store, state, effect);
        }
        return state;
    }
}
exports.Mimikyu = Mimikyu;
