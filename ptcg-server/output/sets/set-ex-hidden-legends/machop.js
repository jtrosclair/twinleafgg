"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Machop = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Machop extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 50;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Knuckle Punch',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Karate Chop',
                cost: [F, C],
                damage: 30,
                damageCalculation: '-',
                text: 'Does 30 damage minus 10 damage for each damage counter on Machop.'
            }];
        this.set = 'HL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '64';
        this.name = 'Machop';
        this.fullName = 'Machop HL';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const damage = Math.max(30 - player.active.damage, 0);
            effect.damage = damage;
        }
        return state;
    }
}
exports.Machop = Machop;
