"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Espurr = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Espurr extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 60;
        this.cardType = P;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Buddy Attack',
                cost: [P],
                damage: 10,
                damageCalculation: '+',
                text: 'If you played Emma from your hand this turn, this attack does 60 more damage.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '36';
        this.usSetNumber = 'CRI 36';
        this.name = 'Espurr';
        this.fullName = 'Espurr M4';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.marker.hasMarker('EMMA_PLAYED_THIS_TURN')) {
                effect.damage += 60;
            }
        }
        return state;
    }
}
exports.Espurr = Espurr;
