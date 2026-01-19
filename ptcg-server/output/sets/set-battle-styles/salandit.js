"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Salandit = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Salandit extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 70;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Call Sign',
                cost: [R],
                damage: 0,
                text: 'Search your deck for a Pokémon, reveal it, and put it into your hand. Then, shuffle your deck.'
            }];
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '27';
        this.name = 'Salandit';
        this.fullName = 'Salandit BST';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND)(store, state, effect.player, {}, { min: 0, max: 1 });
        }
        return state;
    }
}
exports.Salandit = Salandit;
