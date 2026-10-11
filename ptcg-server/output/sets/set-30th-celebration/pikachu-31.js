"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachu31 = void 0;
const game_1 = require("../../game");
/** #31 — Gnaw (free retreat) */
class Pikachu31 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 50;
        this.cardType = game_1.CardType.LIGHTNING;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [];
        this.attacks = [{
                name: 'Gnaw',
                cost: [game_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '31';
        this.name = 'Pikachu';
        this.fullName = 'Pikachu 30C 31';
    }
    reduceEffect(store, state, effect) {
        return state;
    }
}
exports.Pikachu31 = Pikachu31;
