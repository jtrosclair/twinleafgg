"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magikarp = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Magikarp extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Magikarp';
        this.set = 'BS';
        this.fullName = 'Magikarp BS';
        this.cardType = card_types_1.CardType.WATER;
        this.stage = card_types_1.Stage.BASIC;
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '35';
        this.hp = 30;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Tackle',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            },
            {
                name: 'Flail',
                cost: [card_types_1.CardType.WATER],
                damage: 10,
                text: 'Does 10 damage times the number of damage counters on Magikarp.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            effect.damage = effect.player.active.damage;
        }
        return state;
    }
}
exports.Magikarp = Magikarp;
