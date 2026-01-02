"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkGolduck = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class DarkGolduck extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Psyduck';
        this.tags = [game_1.CardTag.DARK];
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Third Eye',
                cost: [P],
                damage: 0,
                text: 'Discard 1 Energy card attached to Dark Golduck in order to draw up to 3 cards.'
            },
            {
                name: 'Super Psy',
                cost: [P, P, C],
                damage: 50,
                text: ''
            }];
        this.set = 'TR';
        this.setNumber = '37';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dark Golduck';
        this.fullName = 'Dark Golduck TR';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
            prefabs_1.DRAW_CARDS(effect.player, 3);
        }
        return state;
    }
}
exports.DarkGolduck = DarkGolduck;
