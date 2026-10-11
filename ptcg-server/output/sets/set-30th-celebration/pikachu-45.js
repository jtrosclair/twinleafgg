"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachu45 = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
/** #45 — Nighttime Stroll + Static Shock */
class Pikachu45 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 60;
        this.cardType = game_1.CardType.LIGHTNING;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Nighttime Stroll',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Draw a card.'
            },
            {
                name: 'Static Shock',
                cost: [game_1.CardType.LIGHTNING, game_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '45';
        this.name = 'Pikachu';
        this.fullName = 'Pikachu 30C 45';
    }
    reduceEffect(store, state, effect) {
        // Nighttime Stroll
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.DRAW_CARDS)(effect.player, 1);
        }
        return state;
    }
}
exports.Pikachu45 = Pikachu45;
