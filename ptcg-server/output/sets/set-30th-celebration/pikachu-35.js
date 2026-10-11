"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachu35 = void 0;
const game_1 = require("../../game");
/** #35 — Rollout */
class Pikachu35 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 60;
        this.cardType = game_1.CardType.LIGHTNING;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Rollout',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '35';
        this.name = 'Pikachu';
        this.fullName = 'Pikachu 30C 35';
    }
}
exports.Pikachu35 = Pikachu35;
