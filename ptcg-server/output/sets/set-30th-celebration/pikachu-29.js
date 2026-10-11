"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachu29 = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
/** #29 — Find a Friend */
class Pikachu29 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 60;
        this.cardType = game_1.CardType.LIGHTNING;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Find a Friend',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Search your deck for a Pokémon, reveal it, and put it into your hand. Then, shuffle your deck.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '29';
        this.name = 'Pikachu';
        this.fullName = 'Pikachu 30C 29';
    }
    reduceEffect(store, state, effect) {
        // Find a Friend
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND)(store, state, effect.player, {}, { min: 0, max: 1 });
        }
        return state;
    }
}
exports.Pikachu29 = Pikachu29;
