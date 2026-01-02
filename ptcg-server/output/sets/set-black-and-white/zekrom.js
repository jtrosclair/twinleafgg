"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zekrom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Zekrom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Outrage',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                damageCalculation: '+',
                text: 'Does 10 more damage for each damage counter on this Pokemon.'
            },
            {
                name: 'Bolt Strike',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'This Pokemon does 40 damage to itself.'
            }
        ];
        this.set = 'BLW';
        this.name = 'Zekrom';
        this.fullName = 'Zekrom BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '47';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            effect.damage += effect.player.active.damage;
            return state;
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            return prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 40);
        }
        return state;
    }
}
exports.Zekrom = Zekrom;
