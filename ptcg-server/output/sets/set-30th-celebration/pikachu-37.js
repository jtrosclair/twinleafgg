"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachu37 = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
/** #37 — Energized Tail + Pika Punch */
class Pikachu37 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 70;
        this.cardType = game_1.CardType.LIGHTNING;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Energized Tail',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Search your deck for an Energy card, reveal it, and put it into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Pika Punch',
                cost: [game_1.CardType.LIGHTNING, game_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '37';
        this.name = 'Pikachu';
        this.fullName = 'Pikachu 30C 37';
    }
    reduceEffect(store, state, effect) {
        // Energized Tail
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, effect.player, this, { superType: game_1.SuperType.ENERGY }, { min: 0, max: 1, allowCancel: false }, this.attacks[0]);
        }
        return state;
    }
}
exports.Pikachu37 = Pikachu37;
