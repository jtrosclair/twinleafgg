"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ambipom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ambipom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Aipom';
        this.cardType = C;
        this.hp = 80;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Double Hit',
                cost: [C],
                damage: 20,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 20 damage times the number of heads.'
            },
            {
                name: 'Hand Fling',
                cost: [C, C],
                damage: 10,
                damageCalculation: 'x',
                text: 'Does 10 damage times the number of cards in your hand.'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '100';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Ambipom';
        this.fullName = 'Ambipom DRX';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 2, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 20 * heads;
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            effect.damage = 10 * player.hand.cards.length;
        }
        return state;
    }
}
exports.Ambipom = Ambipom;
