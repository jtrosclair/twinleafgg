"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Phanpy = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Phanpy extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: W }];
        this.resistance = [{ type: L, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Flail',
                cost: [C],
                damage: 10,
                damageCalculation: 'x',
                text: 'Does 10 damage times the number of damage counters on Phanpy.'
            }];
        this.set = 'HS';
        this.name = 'Phanpy';
        this.fullName = 'Phanpy HS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '77';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            effect.damage = effect.player.active.damage;
        }
        return state;
    }
}
exports.Phanpy = Phanpy;
