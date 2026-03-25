"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lapras = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lapras extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Call for Family',
                cost: [W],
                damage: 0,
                text: 'Search your deck for up to 2 Basic Pokémon and put them onto your Bench. Shuffle your deck afterward.'
            },
            {
                name: 'Reckless Charge',
                cost: [C, C],
                damage: 40,
                text: 'This Pokémon does 20 damage to itself.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '25';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lapras';
        this.fullName = 'Lapras NXD';
    }
    reduceEffect(store, state, effect) {
        // Call for Family - search for up to 2 Basic Pokémon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, player, { stage: card_types_1.Stage.BASIC }, { min: 0, max: 2 });
        }
        // Reckless Charge - self damage
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 20);
        }
        return state;
    }
}
exports.Lapras = Lapras;
