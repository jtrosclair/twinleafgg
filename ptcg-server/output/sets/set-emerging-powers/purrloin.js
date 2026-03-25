"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Purrloin = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Purrloin extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Knock Off',
                cost: [D, C],
                damage: 20,
                text: 'Flip a coin. If heads, discard a random card from your opponent\'s hand.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '64';
        this.name = 'Purrloin';
        this.fullName = 'Purrloin EPO';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result && opponent.hand.cards.length > 0) {
                    const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
                    const cardToDiscard = opponent.hand.cards[randomIndex];
                    opponent.hand.moveCardTo(cardToDiscard, opponent.discard);
                }
            });
        }
        return state;
    }
}
exports.Purrloin = Purrloin;
