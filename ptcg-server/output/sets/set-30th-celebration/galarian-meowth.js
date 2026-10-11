"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalarianMeowth = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class GalarianMeowth extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 70;
        this.cardType = card_types_1.CardType.METAL;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Pay Day',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'Draw a card.'
            }, {
                name: 'Treasure Rush',
                cost: [card_types_1.CardType.METAL],
                damage: 10,
                damageCalculation: 'x',
                text: 'This attack does 10 damage for each card in your hand.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '101';
        this.name = 'Galarian Meowth';
        this.fullName = 'Galarian Meowth 30C';
    }
    reduceEffect(store, state, effect) {
        // Pay Day
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.DRAW_CARDS)(effect.player, 1);
        }
        // Treasure Rush
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            effect.damage = 10 * effect.player.hand.cards.length;
        }
        return state;
    }
}
exports.GalarianMeowth = GalarianMeowth;
