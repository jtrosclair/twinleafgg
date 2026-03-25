"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Croconaw = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
class Croconaw extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Totodile';
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = L;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Scary Face',
                cost: [C],
                damage: 0,
                text: 'Flip a coin. If heads, the Defending Pokémon can\'t attack or retreat during your opponent\'s next turn.'
            },
            {
                name: 'Slash',
                cost: [L, C, C],
                damage: 50,
                text: ''
            }];
        this.set = 'DF';
        this.name = 'Croconaw';
        this.fullName = 'Croconaw DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '27';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
                }
            });
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        return state;
    }
}
exports.Croconaw = Croconaw;
