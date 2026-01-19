"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weedle = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Weedle extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 50;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Poison Sting',
                cost: [G],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Poisoned.'
            },
        ];
        this.set = 'CIN';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '1';
        this.name = 'Weedle';
        this.fullName = 'Weedle CIN';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
        }
        return state;
    }
}
exports.Weedle = Weedle;
