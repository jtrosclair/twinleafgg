"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachu50 = void 0;
const game_1 = require("../../game");
/** #50 — Satisfied Spark */
class Pikachu50 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 80;
        this.cardType = game_1.CardType.LIGHTNING;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Satisfied Spark',
                cost: [game_1.CardType.LIGHTNING, game_1.CardType.LIGHTNING, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 100,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '50';
        this.name = 'Pikachu';
        this.fullName = 'Pikachu 30C 50';
    }
}
exports.Pikachu50 = Pikachu50;
