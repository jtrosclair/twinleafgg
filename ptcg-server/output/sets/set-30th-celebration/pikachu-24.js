"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachu24 = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
/** #24 — Volt Tackle */
class Pikachu24 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 70;
        this.cardType = game_1.CardType.LIGHTNING;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Volt Tackle',
                cost: [game_1.CardType.LIGHTNING, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 80,
                text: 'This Pokémon also does 30 damage to itself.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '24';
        this.name = 'Pikachu';
        this.fullName = 'Pikachu 30C 24';
    }
    reduceEffect(store, state, effect) {
        // Volt Tackle
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 30);
        }
        return state;
    }
}
exports.Pikachu24 = Pikachu24;
