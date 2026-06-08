"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Goomy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Goomy extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 60;
        this.cardType = N;
        this.weakness = [];
        this.resistance = [];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Absorb',
                cost: [W, P],
                damage: 30,
                text: 'Heal 30 damage from this Pokemon.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '64';
        this.usSetNumber = 'POR 64';
        this.name = 'Goomy';
        this.fullName = 'Goomy M4';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect, store, state, 30);
        }
        return state;
    }
}
exports.Goomy = Goomy;
