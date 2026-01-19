"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yungoos = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Yungoos extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Collect',
                cost: [C],
                damage: 0,
                text: 'Draw a card.'
            },
            {
                name: 'Gnaw',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'MEG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '109';
        this.name = 'Yungoos';
        this.fullName = 'Yungoos M1L';
        this.regulationMark = 'I';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.DRAW_CARDS)(effect.player, 1);
        }
        return state;
    }
}
exports.Yungoos = Yungoos;
