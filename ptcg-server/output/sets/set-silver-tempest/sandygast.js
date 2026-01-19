"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sandygast = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Sandygast extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'F';
        this.cardType = F;
        this.hp = 80;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Corner',
                cost: [F],
                damage: 10,
                text: 'During your opponent\'s next turn, the Defending Pokemon can\'t retreat.'
            }];
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '99';
        this.name = 'Sandygast';
        this.fullName = 'Sandygast SIT';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        return state;
    }
}
exports.Sandygast = Sandygast;
