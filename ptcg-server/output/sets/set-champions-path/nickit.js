"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nickit = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Nickit extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Filch',
                cost: [C],
                damage: 0,
                text: 'Draw a card.'
            },
            {
                name: 'Tail Smack',
                cost: [D, C],
                damage: 30,
                text: ''
            }];
        this.set = 'CPA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '46';
        this.name = 'Nickit';
        this.fullName = 'Nickit CPA';
        this.regulationMark = 'D';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.DRAW_CARDS)(effect.player, 1);
        }
        return state;
    }
}
exports.Nickit = Nickit;
