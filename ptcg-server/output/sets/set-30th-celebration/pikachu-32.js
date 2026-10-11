"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachu32 = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
/** #32 — Scurry About */
class Pikachu32 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 50;
        this.cardType = game_1.CardType.LIGHTNING;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Scurry About',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '32';
        this.name = 'Pikachu';
        this.fullName = 'Pikachu 30C 32';
    }
    reduceEffect(store, state, effect) {
        // Scurry About
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, effect.player);
        }
        return state;
    }
}
exports.Pikachu32 = Pikachu32;
