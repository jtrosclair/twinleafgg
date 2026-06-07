"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Furfrou = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Furfrou extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Hand Cut',
                cost: [C],
                damage: 0,
                text: 'Discard random cards from your opponent\'s hand until they have 5 cards in their hand.'
            },
            {
                name: 'Headbutt',
                cost: [C],
                damage: 30,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '66';
        this.usSetNumber = 'POR 67';
        this.name = 'Furfrou';
        this.fullName = 'Furfrou M3';
    }
    reduceEffect(store, state, effect) {
        // Hand Cut - discard random cards until opponent has 5 cards
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Discard random cards until hand size is 5
            while (opponent.hand.cards.length > 5) {
                const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
                const randomCard = opponent.hand.cards[randomIndex];
                opponent.hand.moveCardTo(randomCard, opponent.discard);
            }
        }
        return state;
    }
}
exports.Furfrou = Furfrou;
