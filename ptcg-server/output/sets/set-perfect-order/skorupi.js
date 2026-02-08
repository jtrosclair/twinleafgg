"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skorupi = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Skorupi extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 80;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Poison Jab',
                cost: [D, D],
                damage: 20,
                text: 'Your opponent\'s Active Pokemon is now Poisoned.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '50';
        this.name = 'Skorupi';
        this.fullName = 'Skorupi M3';
    }
    reduceEffect(store, state, effect) {
        // Poison Jab - poison opponent's Active Pokemon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Skorupi = Skorupi;
