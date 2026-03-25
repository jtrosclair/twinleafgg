"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KyuremEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class KyuremEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 180;
        this.weakness = [{ type: M }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Outrage',
                cost: [C, C],
                damage: 30,
                damageCalculation: '+',
                text: 'Does 10 more damage for each damage counter on this Pok\u00e9mon.'
            },
            {
                name: 'Giga Frost',
                cost: [W, W, C, C],
                damage: 150,
                text: 'Discard 2 [W] Energy attached to this Pok\u00e9mon.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '30';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Kyurem-EX';
        this.fullName = 'Kyurem-EX PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            effect.damage += player.active.damage;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 2, card_types_1.CardType.WATER);
        }
        return state;
    }
}
exports.KyuremEx = KyuremEx;
