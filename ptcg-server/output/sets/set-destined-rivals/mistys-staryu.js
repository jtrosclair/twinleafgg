"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MistysStaryu = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const state_utils_1 = require("../../game/store/state-utils");
class MistysStaryu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.MISTYS];
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'I';
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Bubble Beam',
                cost: [W],
                damage: 20,
                text: 'If heads, your opponent\'s Active Pokémon is now Paralyzed.'
            }];
        this.set = 'DRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '46';
        this.name = 'Misty\'s Staryu';
        this.fullName = 'Misty\'s Staryu DRI';
    }
    reduceEffect(store, state, effect) {
        // Bubble Beam
        if (prefabs_1.AFTER_ATTACK(effect, 0, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => {
                if (result) {
                    prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, state_utils_1.StateUtils.getOpponent(state, effect.player), this);
                }
            });
        }
        return state;
    }
}
exports.MistysStaryu = MistysStaryu;
