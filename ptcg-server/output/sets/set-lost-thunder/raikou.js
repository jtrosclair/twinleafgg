"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Raikou = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Raikou extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 120;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Lost Voltage',
                cost: [L, C],
                damage: 30,
                damageCalculation: '+',
                text: 'If you have any [L] Energy cards in the Lost Zone, this attack does 90 more damage.'
            }];
        this.set = 'LOT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '79';
        this.name = 'Raikou';
        this.fullName = 'Raikou LOT';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            if (effect.player.lostzone.cards.some(c => c instanceof game_1.EnergyCard && c.provides.includes(card_types_1.CardType.LIGHTNING))) {
                effect.damage += 90;
            }
        }
        return state;
    }
}
exports.Raikou = Raikou;
