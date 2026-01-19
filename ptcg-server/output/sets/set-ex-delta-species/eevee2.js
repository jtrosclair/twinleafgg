"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eevee2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Eevee2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Call for Family',
                cost: [C],
                damage: 0,
                text: 'Search your deck for a Basic Pokémon and put it onto your Bench. Shuffle your deck afterward.'
            },
            {
                name: 'Rear Kick',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'DS';
        this.name = 'Eevee';
        this.fullName = 'Eevee DS 69';
        this.setNumber = '69';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, effect.player, { stage: card_types_1.Stage.BASIC }, { min: 0, max: 1 });
        }
        return state;
    }
}
exports.Eevee2 = Eevee2;
