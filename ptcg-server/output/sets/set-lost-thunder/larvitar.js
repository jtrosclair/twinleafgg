"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Larvitar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Larvitar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Second Strike',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 10,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon already has 3 or more damage counters on it, this attack does 70 more damage.'
            }
        ];
        this.set = 'LOT';
        this.setNumber = '115';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Larvitar';
        this.fullName = 'Larvitar LOT';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            if (effect.opponent.active.damage >= 30) {
                effect.damage += 70;
            }
        }
        return state;
    }
}
exports.Larvitar = Larvitar;
