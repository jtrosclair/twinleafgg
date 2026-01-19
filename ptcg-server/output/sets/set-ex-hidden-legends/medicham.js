"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Medicham = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Medicham extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Meditite';
        this.cardType = F;
        this.hp = 80;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Meditate',
                cost: [F, C],
                damage: 20,
                damageCalculation: '+',
                text: 'Does 20 damage plus 10 more damage for each damage counter on the Defending Pokémon.'
            },
            {
                name: 'Chakra Points',
                cost: [F, C, C],
                damage: 10,
                damageCalculation: '+',
                text: 'Does 10 damage plus 10 more damage for each card in your opponent\'s hand.'
            }];
        this.set = 'HL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '10';
        this.name = 'Medicham';
        this.fullName = 'Medicham HL';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            effect.damage += effect.target.damage;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            effect.damage += effect.opponent.hand.cards.length * 10;
        }
        return state;
    }
}
exports.Medicham = Medicham;
