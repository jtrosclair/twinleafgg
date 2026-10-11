"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gholdengo = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gholdengo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Gimmighoul';
        this.hp = 130;
        this.cardType = card_types_1.CardType.METAL;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Celebration',
                cost: [card_types_1.CardType.METAL],
                damage: 0,
                text: 'If you have exactly 30 cards in your hand, take 2 Prize cards. If you do, shuffle your hand into your deck.'
            },
            {
                name: 'Triple Smash',
                cost: [card_types_1.CardType.METAL],
                damage: 50,
                damageCalculation: 'x',
                text: 'Flip 3 coins. This attack does 50 damage for each heads.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '108';
        this.name = 'Gholdengo';
        this.fullName = 'Gholdengo 30C';
    }
    reduceEffect(store, state, effect) {
        // Celebration
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.hand.cards.length === 30) {
                return (0, prefabs_1.TAKE_X_PRIZES)(store, state, player, 2, {}, () => {
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.deck, { sourceCard: this });
                    (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                });
            }
        }
        // Triple Smash
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 3, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 50 * heads;
            });
        }
        return state;
    }
}
exports.Gholdengo = Gholdengo;
