"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spearow = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Spearow extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 40;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Spearhead',
                cost: [C],
                damage: 0,
                text: 'Draw a card.'
            }];
        this.set = 'CG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '61';
        this.name = 'Spearow';
        this.fullName = 'Spearow CG';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.DRAW_CARDS(effect.player, 1);
        }
        return state;
    }
}
exports.Spearow = Spearow;
