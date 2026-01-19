"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeasManaphy3 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class SeasManaphy3 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Call for Famitly',
                cost: [C],
                damage: 0,
                text: 'Search your deck for up to 2 [W] Basic Pokémon and put them onto your Bench. Shuffle your deck afterward.'
            },
            {
                name: 'Surf',
                cost: [W, C, C],
                damage: 40,
                text: ''
            }];
        this.set = 'PCGP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '147';
        this.name = 'Sea\'s Manaphy';
        this.fullName = 'Sea\'s Manaphy PCGP 147';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, effect.player, { cardType: card_types_1.CardType.WATER, stage: card_types_1.Stage.BASIC }, { min: 0, max: 2 });
        }
        return state;
    }
}
exports.SeasManaphy3 = SeasManaphy3;
