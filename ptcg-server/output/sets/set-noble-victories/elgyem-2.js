"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Elgyem2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Elgyem2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Round Up',
                cost: [P],
                damage: 0,
                text: 'Search your deck for 2 Basic Pokémon and put them onto your Bench. Shuffle your deck afterward.'
            },
            {
                name: 'Headbutt',
                cost: [P, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'NVI';
        this.setNumber = '55';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Elgyem';
        this.fullName = 'Elgyem NVI 55';
    }
    reduceEffect(store, state, effect) {
        // Round Up - search deck for 2 basic Pokémon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, player, { stage: card_types_1.Stage.BASIC }, { min: 0, max: 2, allowCancel: true });
        }
        return state;
    }
}
exports.Elgyem2 = Elgyem2;
