"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Barboach = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Barboach extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Hide',
                cost: [F],
                damage: 0,
                text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
            },
            {
                name: 'Mud-Slap',
                cost: [F, C],
                damage: 20,
                text: ''
            }];
        this.set = 'OBF';
        this.setNumber = '108';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Barboach';
        this.fullName = 'Barboach OBF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.PREVENT_DAMAGE)(store, state, effect, this);
                }
            });
        }
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.cards.includes(this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const sourceCard = effect.source.getPokemonCard();
            if (sourceCard && opponent.active.marker.hasMarker(marker_constants_1.MarkerConstants.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this)) {
                effect.preventDefault = true;
            }
        }
        (0, prefabs_1.CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN)(state, effect, marker_constants_1.MarkerConstants.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, marker_constants_1.MarkerConstants.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
        return state;
    }
}
exports.Barboach = Barboach;
