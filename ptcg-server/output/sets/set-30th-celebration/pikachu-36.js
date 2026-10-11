"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachu36 = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
/** #36 — Slight Intrusion */
class Pikachu36 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 70;
        this.cardType = game_1.CardType.LIGHTNING;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Slight Intrusion',
                cost: [game_1.CardType.LIGHTNING, game_1.CardType.COLORLESS],
                damage: 40,
                text: 'This Pokémon also does 10 damage to itself.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '36';
        this.name = 'Pikachu';
        this.fullName = 'Pikachu 30C 36';
    }
    reduceEffect(store, state, effect) {
        // Slight Intrusion
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 10);
        }
        return state;
    }
}
exports.Pikachu36 = Pikachu36;
