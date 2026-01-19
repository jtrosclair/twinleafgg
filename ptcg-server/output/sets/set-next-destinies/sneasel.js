"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sneasel = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const prefabs_2 = require("../../game/store/prefabs/prefabs");
class Sneasel extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Corner',
                cost: [D],
                damage: 10,
                text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
            },
            {
                name: 'Scratch',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'NXD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '69';
        this.name = 'Sneasel';
        this.fullName = 'Sneasel NXD';
        this.CORNER_MARKER = 'CORNER_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_2.ADD_MARKER)(this.CORNER_MARKER, opponent.active, this);
        }
        (0, prefabs_2.BLOCK_RETREAT_IF_MARKER)(effect, this.CORNER_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, this.CORNER_MARKER, this);
        return state;
    }
}
exports.Sneasel = Sneasel;
