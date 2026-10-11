"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachu52 = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
/** #52 — Angry Bolt */
class Pikachu52 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 70;
        this.cardType = game_1.CardType.LIGHTNING;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Angry Bolt',
                cost: [game_1.CardType.LIGHTNING],
                damage: 10,
                damageCalculation: '+',
                text: 'This attack does 10 more damage for each damage counter on this Pokémon.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '52';
        this.name = 'Pikachu';
        this.fullName = 'Pikachu 30C 52';
    }
    reduceEffect(store, state, effect) {
        // Angry Bolt
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const counters = Math.floor(effect.source.damage / 10);
            effect.damage += 10 * counters;
        }
        return state;
    }
}
exports.Pikachu52 = Pikachu52;
