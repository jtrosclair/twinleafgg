"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drilbur = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Drilbur extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Call for Family',
                cost: [C],
                damage: 0,
                text: 'Search your deck for 2 Basic Pokémon and put them onto your Bench. Shuffle your deck afterwards.',
            },
            {
                name: 'Dig Claws',
                cost: [C, C, C],
                damage: 50,
                text: '',
            }];
        this.set = 'M5';
        this.setNumber = '44';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Drilbur';
        this.fullName = 'Drilbur M5';
    }
    reduceEffect(store, state, effect) {
        // Ref: set-sword-and-shield/grookey.ts (Call for Family — up to 2 Basic)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, effect.player, { stage: card_types_1.Stage.BASIC }, { min: 0, max: 2 });
        }
        return state;
    }
}
exports.Drilbur = Drilbur;
