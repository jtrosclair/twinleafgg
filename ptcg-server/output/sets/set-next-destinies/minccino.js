"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Minccino = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Minccino extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Call for Family',
                cost: [C],
                damage: 0,
                text: 'Search your deck for a Basic Pokémon and put it onto your Bench. Shuffle your deck afterward.'
            },
            {
                name: 'Tail Smack',
                cost: [C, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'NXD';
        this.setNumber = '84';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Minccino';
        this.fullName = 'Minccino NXD';
    }
    reduceEffect(store, state, effect) {
        // Call for Family - search for a Basic Pokémon and put onto bench
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, player, { stage: card_types_1.Stage.BASIC }, { min: 0, max: 1 });
        }
        return state;
    }
}
exports.Minccino = Minccino;
