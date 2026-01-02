"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Xerneas = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Xerneas extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 120;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Geogate',
                cost: [P],
                damage: 0,
                text: 'Search your deck for up to 3 Basic [P] Pokémon and put them onto your Bench. Then, shuffle your deck.'
            },
            {
                name: 'Bright Horns',
                cost: [P, P, C],
                damage: 120,
                text: 'This Pokémon can\'t use Bright Horns during your next turn.'
            }];
        this.set = 'MEG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '64';
        this.name = 'Xerneas';
        this.fullName = 'Xerneas M1S';
        this.regulationMark = 'I';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.ATTACK_USED_2_MARKER, this);
        prefabs_1.REPLACE_MARKER_AT_END_OF_TURN(effect, this.ATTACK_USED_MARKER, this.ATTACK_USED_2_MARKER, this);
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, effect.player, { stage: card_types_1.Stage.BASIC, cardType: card_types_1.CardType.PSYCHIC }, { min: 0, max: 3 });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.BLOCK_EFFECT_IF_MARKER(this.ATTACK_USED_2_MARKER, this, this);
            prefabs_1.ADD_MARKER(this.ATTACK_USED_MARKER, this, this);
        }
        return state;
    }
}
exports.Xerneas = Xerneas;
