"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pumpkaboo = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Pumpkaboo extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Confuse Ray',
                cost: [P],
                damage: 0,
                text: 'Your opponent\'s Active Pokemon is now Confused.'
            }
        ];
        this.set = 'XY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '56';
        this.name = 'Pumpkaboo';
        this.fullName = 'Pumpkaboo XY';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.AFTER_ATTACK(effect, 0, this)) {
            prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
        }
        return state;
    }
}
exports.Pumpkaboo = Pumpkaboo;
