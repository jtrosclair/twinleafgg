"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Solosis = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Solosis extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 30;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Cell Culture',
                cost: [P],
                damage: 0,
                text: 'Search your deck for Solosis and put it onto your Bench. Shuffle your deck afterward.'
            },
            {
                name: 'Rollout',
                cost: [P, C],
                damage: 20,
                text: ''
            }];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '55';
        this.name = 'Solosis';
        this.fullName = 'Solosis BLW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, effect.player, { name: 'Solosis' }, { min: 0, max: 1 });
        }
        return state;
    }
}
exports.Solosis = Solosis;
