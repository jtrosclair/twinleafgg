"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zigzagoon = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Zigzagoon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 40;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Collect',
                cost: [C],
                damage: 0,
                text: 'Draw a card.'
            },
            {
                name: 'Headbutt',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'SS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '85';
        this.name = 'Zigzagoon';
        this.fullName = 'Zigzagoon SS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.DRAW_CARDS)(effect.player, 1);
        }
        return state;
    }
}
exports.Zigzagoon = Zigzagoon;
