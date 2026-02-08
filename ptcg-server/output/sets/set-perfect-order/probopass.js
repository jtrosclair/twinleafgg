"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Probopass = void 0;
const game_1 = require("../../game");
const costs_1 = require("../../game/store/prefabs/costs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Probopass extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Nosepass';
        this.cardType = F;
        this.hp = 140;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Avalanche',
                cost: [F, F],
                damage: 60,
                text: ''
            },
            {
                name: 'Nose Bumper',
                cost: [F, F, F, C],
                damage: 260,
                text: 'Discard 3 Energy from this Pokemon.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '37';
        this.name = 'Probopass';
        this.fullName = 'Probopass M3';
    }
    reduceEffect(store, state, effect) {
        // Nose Bumper - discard 3 Energy from this Pokemon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 3);
        }
        return state;
    }
}
exports.Probopass = Probopass;
