"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Claydol = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Claydol extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Baltoy';
        this.hp = 120;
        this.cardType = F;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Devolution Ray',
                cost: [F],
                damage: 50,
                text: 'If your opponent\'s Active Pokemon is an Evolved Pokemon, devolve it by putting the highest Stage Evolution card on it into your opponent\'s hand.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '47';
        this.name = 'Claydol';
        this.fullName = 'Claydol M4';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.DEVOLVE_DEFENDING_AFTER_ATTACK)(store, state, effect, 0, this, 'hand');
        }
        return state;
    }
}
exports.Claydol = Claydol;
