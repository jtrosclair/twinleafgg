"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachu27 = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
/** #27 — Nap */
class Pikachu27 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 80;
        this.cardType = game_1.CardType.LIGHTNING;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Nap',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Heal 30 damage from this Pokémon.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '27';
        this.name = 'Pikachu';
        this.fullName = 'Pikachu 30C 27';
    }
    reduceEffect(store, state, effect) {
        // Nap
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect, store, state, 30);
        }
        return state;
    }
}
exports.Pikachu27 = Pikachu27;
