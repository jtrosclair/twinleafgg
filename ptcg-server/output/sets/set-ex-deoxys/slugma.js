"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slugma = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Slugma extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 50;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Collect',
                cost: [C],
                damage: 0,
                text: 'Draw a card.'
            },
            {
                name: 'Combustion',
                cost: [R],
                damage: 10,
                text: ''
            }
        ];
        this.set = 'DX';
        this.setNumber = '74';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Slugma';
        this.fullName = 'Slugma DX';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.AFTER_ATTACK(effect, 0, this)) {
            prefabs_1.DRAW_CARDS(effect.player, 1);
        }
        return state;
    }
}
exports.Slugma = Slugma;
