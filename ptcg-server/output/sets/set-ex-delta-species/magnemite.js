"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magnemite = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Magnemite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Collect',
                cost: [C],
                damage: 0,
                text: 'Draw a card.'
            },
            {
                name: 'Magnetic Blast',
                cost: [L],
                damage: 10,
                text: ''
            }];
        this.set = 'DS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '74';
        this.name = 'Magnemite';
        this.fullName = 'Magnemite DS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.DRAW_CARDS)(effect.player, 1);
        }
        return state;
    }
}
exports.Magnemite = Magnemite;
