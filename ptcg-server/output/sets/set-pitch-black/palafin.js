"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Palafin = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Palafin extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Finizen';
        this.cardType = W;
        this.hp = 150;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Justice Knuckle',
                cost: [W, W],
                damage: 80,
                damageCalculation: '+',
                text: 'If your opponent has 1 Prize card remaining, this attack does 200 more damage.',
            }];
        this.set = 'M5';
        this.setNumber = '21';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Palafin';
        this.fullName = 'Palafin M5';
    }
    reduceEffect(_store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            if (opponent.getPrizeLeft() === 1) {
                effect.damage += 200;
            }
        }
        return state;
    }
}
exports.Palafin = Palafin;
