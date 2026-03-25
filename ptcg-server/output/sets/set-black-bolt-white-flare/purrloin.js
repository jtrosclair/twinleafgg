"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Purrloin = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Purrloin extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 60;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Invite Evil',
                cost: [D],
                damage: 0,
                text: 'Search your deck for up to 3 [D] Pokémon, reveal them, and put them into your hand. Shuffle your deck afterward.'
            }];
        this.set = 'WHT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '55';
        this.name = 'Purrloin';
        this.fullName = 'Purrloin WHT';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND)(store, state, effect.player, { cardType: card_types_1.CardType.DARK }, { min: 0, max: 3 });
        }
        return state;
    }
}
exports.Purrloin = Purrloin;
