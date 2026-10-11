"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachu41 = void 0;
const game_1 = require("../../game");
/** #41 — Hang Down + Zap Kick */
class Pikachu41 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 60;
        this.cardType = game_1.CardType.LIGHTNING;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Hang Down',
                cost: [game_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            },
            {
                name: 'Zap Kick',
                cost: [game_1.CardType.LIGHTNING, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 40,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '41';
        this.name = 'Pikachu';
        this.fullName = 'Pikachu 30C 41';
    }
}
exports.Pikachu41 = Pikachu41;
