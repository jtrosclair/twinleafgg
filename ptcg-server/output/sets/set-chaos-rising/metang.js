"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metang = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Metang extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Beldum';
        this.hp = 100;
        this.cardType = M;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Metal Claw',
                cost: [M],
                damage: 30,
                text: ''
            },
            {
                name: 'Guard Press',
                cost: [M, M, C],
                damage: 70,
                text: 'During your opponent\'s next turn, this Pokemon takes 30 less damage from attacks.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '58';
        this.usSetNumber = 'POR 58';
        this.name = 'Metang';
        this.fullName = 'Metang M4';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            effect.player.active.damageReductionNextTurn = 30;
        }
        return state;
    }
}
exports.Metang = Metang;
