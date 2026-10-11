"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachu30 = void 0;
const game_1 = require("../../game");
/** #30 — Mach Bolt */
class Pikachu30 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 60;
        this.cardType = game_1.CardType.LIGHTNING;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Mach Bolt',
                cost: [game_1.CardType.LIGHTNING],
                damage: 30,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '30';
        this.name = 'Pikachu';
        this.fullName = 'Pikachu 30C 30';
    }
    reduceEffect(store, state, effect) {
        return state;
    }
}
exports.Pikachu30 = Pikachu30;
