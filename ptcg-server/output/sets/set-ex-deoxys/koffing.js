"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Koffing = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Koffing extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 50;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Smog',
                cost: [G],
                damage: 0,
                text: 'The Defending Pokémon is now Poisoned.'
            },
        ];
        this.set = 'DX';
        this.setNumber = '62';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Koffing';
        this.fullName = 'Koffing DX';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Koffing = Koffing;
