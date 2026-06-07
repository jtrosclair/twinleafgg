"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Luxray = void 0;
const game_1 = require("../../game");
const costs_1 = require("../../game/store/prefabs/costs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Luxray extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Luxio';
        this.cardType = L;
        this.hp = 150;
        this.weakness = [{ type: F }];
        this.retreat = [];
        this.attacks = [{
                name: 'Pressure',
                cost: [L, C],
                damage: 0,
                damageCalculation: 'x',
                text: 'This attack does 70 damage for each Prize card you have taken.'
            },
            {
                name: 'Strong Bolt',
                cost: [L, C, C],
                damage: 200,
                text: 'Discard 2 Energy from this Pokemon.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '27';
        this.usSetNumber = 'POR 28';
        this.name = 'Luxray';
        this.fullName = 'Luxray M3';
    }
    reduceEffect(store, state, effect) {
        // Pressure - 70x damage per prize card taken
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            effect.damage = player.prizesTaken * 70;
        }
        // Strong Bolt - discard 2 energy
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 2);
        }
        return state;
    }
}
exports.Luxray = Luxray;
