"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Garbodor = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
class Garbodor extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Trubbish';
        this.cardType = P;
        this.hp = 100;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Gentle Wrap',
                cost: [P, C],
                damage: 30,
                text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
            },
            {
                name: 'Sludge Toss',
                cost: [P, C, C, C],
                damage: 60,
                text: 'The Defending Pokémon is now Poisoned.'
            }
        ];
        this.set = 'NVI';
        this.setNumber = '49';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Garbodor';
        this.fullName = 'Garbodor NVI';
    }
    reduceEffect(store, state, effect) {
        // Gentle Wrap - prevent retreat
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        // Sludge Toss - poison
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const addSpecialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.POISONED]);
            store.reduceEffect(state, addSpecialCondition);
        }
        return state;
    }
}
exports.Garbodor = Garbodor;
