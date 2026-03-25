"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Totodile = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Totodile extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = L;
        this.hp = 40;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Scratch',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Rage',
                cost: [L, C],
                damage: 10,
                damageCalculation: '+',
                text: 'Does 10 damage plus 10 more damage for each damage counter on Totodile.'
            }];
        this.set = 'DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '67';
        this.name = 'Totodile';
        this.fullName = 'Totodile DF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            effect.damage += effect.player.active.damage;
        }
        return state;
    }
}
exports.Totodile = Totodile;
