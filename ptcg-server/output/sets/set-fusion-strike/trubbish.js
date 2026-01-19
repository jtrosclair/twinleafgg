"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trubbish = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Trubbish extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Call for Family',
                cost: [D],
                damage: 0,
                text: 'Search your deck for a Basic Pokémon and put it onto your Bench. Then, shuffle your deck.'
            },
            {
                name: 'Super Poison Breath',
                cost: [D, C],
                damage: 20,
                text: 'Your opponent\'s Active Pokémon is now Poisoned.'
            }];
        this.set = 'FST';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '168';
        this.name = 'Trubbish';
        this.fullName = 'Trubbish FST';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, effect.player, { stage: card_types_1.Stage.BASIC }, { min: 0, max: 1 });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED)(store, state, effect);
        }
        return state;
    }
}
exports.Trubbish = Trubbish;
