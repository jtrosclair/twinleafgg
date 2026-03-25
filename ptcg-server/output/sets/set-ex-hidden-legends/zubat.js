"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zubat = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
class Zubat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 50;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Quick Turn',
                cost: [C],
                damage: 10,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 10 damage times the number of heads.'
            },
            {
                name: 'Surprise',
                cost: [G],
                damage: 0,
                text: 'Choose 1 card from your opponent\'s hand without looking. Look at the card you chose, then have your opponent shuffle that card into his or her deck.'
            }];
        this.set = 'HL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '83';
        this.name = 'Zubat';
        this.fullName = 'Zubat HL';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 2, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 10 * heads;
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
            const randomCard = opponent.hand.cards[randomIndex];
            (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, player, [randomCard]);
            (0, prefabs_1.MOVE_CARDS)(store, state, opponent.hand, opponent.deck, { cards: [randomCard], sourceEffect: this.attacks[1] });
            (0, prefabs_1.SHUFFLE_DECK)(store, state, opponent);
        }
        return state;
    }
}
exports.Zubat = Zubat;
