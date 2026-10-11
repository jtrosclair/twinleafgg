"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachu26 = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
/** #26 — Peer At */
class Pikachu26 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 70;
        this.cardType = game_1.CardType.LIGHTNING;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Peer At',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Your opponent reveals their hand.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '26';
        this.name = 'Pikachu';
        this.fullName = 'Pikachu 30C 26';
    }
    reduceEffect(store, state, effect) {
        // Peer At
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            if (opponent.hand.cards.length > 0) {
                (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, effect.player, opponent.hand.cards);
            }
        }
        return state;
    }
}
exports.Pikachu26 = Pikachu26;
