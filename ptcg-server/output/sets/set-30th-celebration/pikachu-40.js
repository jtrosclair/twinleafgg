"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachu40 = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const effect_of_attack_prefabs_1 = require("../../game/store/prefabs/effect-of-attack-prefabs");
/** #40 — Overwriting Bolt */
class Pikachu40 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 80;
        this.cardType = game_1.CardType.LIGHTNING;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Overwriting Bolt',
                cost: [game_1.CardType.LIGHTNING],
                damage: 10,
                text: 'The Defending Pokémon\'s Weakness is now [L] until the end of your next turn. (Apply Weakness as ×2.)'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '40';
        this.name = 'Pikachu';
        this.fullName = 'Pikachu 30C 40';
    }
    reduceEffect(store, state, effect) {
        // Overwriting Bolt
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, effect_of_attack_prefabs_1.DEFENDING_POKEMON_WEAKNESS_IS_NOW)(store, state, effect, this, game_1.CardType.LIGHTNING);
        }
        return state;
    }
}
exports.Pikachu40 = Pikachu40;
