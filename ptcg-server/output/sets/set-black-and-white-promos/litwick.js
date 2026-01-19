"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Litwick = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Litwick extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Call for Family',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Search your deck for a Basic Pokémon and put it onto your Bench. Shuffle your deck afterward. '
            },
            {
                name: 'Will-O-Wisp',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }];
        this.set = 'BWP';
        this.name = 'Litwick';
        this.fullName = 'Litwick BWP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '27';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, effect.player, { stage: card_types_1.Stage.BASIC }, { min: 1, max: 1, allowCancel: true });
        }
        return state;
    }
}
exports.Litwick = Litwick;
