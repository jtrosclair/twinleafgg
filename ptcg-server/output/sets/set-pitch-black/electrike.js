"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Electrike = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Electrike extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Collect',
                cost: [L],
                damage: 0,
                text: 'Draw a card.'
            },
            {
                name: 'Tackle',
                cost: [L, L],
                damage: 30,
                text: ''
            }];
        this.set = 'M5';
        this.setNumber = '22';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Electrike';
        this.fullName = 'Electrike M5';
    }
    reduceEffect(_store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.DRAW_CARDS)(effect.player, 1);
        }
        return state;
    }
}
exports.Electrike = Electrike;
