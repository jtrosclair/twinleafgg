"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Marshtomp = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Marshtomp extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Mudkip';
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Mud Slap',
                cost: [F],
                damage: 20,
                text: ''
            },
            {
                name: 'Double-Edge',
                cost: [C, C, C],
                damage: 40,
                text: 'Marshtomp does 10 damage to itself.'
            }];
        this.set = 'P3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '15';
        this.name = 'Marshtomp';
        this.fullName = 'Marshtomp P3';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 10);
        }
        return state;
    }
}
exports.Marshtomp = Marshtomp;
