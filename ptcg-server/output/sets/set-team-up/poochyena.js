"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poochyena = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Poochyena extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Howl in the Dark',
                cost: [C],
                damage: 0,
                text: 'Search your deck for up to 2 [D] Pokémon, reveal them, and put them into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Bite',
                cost: [D],
                damage: 10,
                text: ''
            }];
        this.set = 'TEU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '86';
        this.name = 'Poochyena';
        this.fullName = 'Poochyena TEU';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND)(store, state, effect.player, { cardType: card_types_1.CardType.DARK }, { min: 0, max: 2 });
        }
        return state;
    }
}
exports.Poochyena = Poochyena;
