"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachu25 = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
/** #25 — Spark */
class Pikachu25 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 70;
        this.cardType = game_1.CardType.LIGHTNING;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Spark',
                cost: [game_1.CardType.LIGHTNING, game_1.CardType.COLORLESS],
                damage: 20,
                text: 'This attack also does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '25';
        this.name = 'Pikachu';
        this.fullName = 'Pikachu 30C 25';
    }
    reduceEffect(store, state, effect) {
        // Spark
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            if (opponent.bench.some(b => b.cards.length > 0)) {
                (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON)(20, effect, store, state);
            }
        }
        return state;
    }
}
exports.Pikachu25 = Pikachu25;
