"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Phanpy = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Phanpy extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Tackle',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Endure',
                cost: [F],
                damage: 0,
                text: 'Flip a coin. If heads, if this Pokémon would be Knocked Out by damage from an attack during your opponent\'s next turn, it is not Knocked Out, and its remaining HP becomes 10.'
            }];
        this.set = 'CES';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '72';
        this.name = 'Phanpy';
        this.fullName = 'Phanpy CES';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const coinFlipEffect = new play_card_effects_1.CoinFlipEffect(effect.player, (result) => {
                if (result) {
                    (0, prefabs_1.ADD_MARKER)(marker_constants_1.MarkerConstants.PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER, effect.player.active, this);
                    (0, prefabs_1.ADD_MARKER)(marker_constants_1.MarkerConstants.CLEAR_PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER, opponent, this);
                }
            });
            store.reduceEffect(state, coinFlipEffect);
            return state;
        }
        //Endure UP
        if (effect instanceof attack_effects_1.PutDamageEffect
            && effect.target.cards.includes(this)
            && (0, prefabs_1.HAS_MARKER)(marker_constants_1.MarkerConstants.PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER, effect.target, this)) {
            effect.surviveOnTenHPReason = this.attacks[1].name;
            return state;
        }
        (0, prefabs_1.CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN)(state, effect, marker_constants_1.MarkerConstants.CLEAR_PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER, marker_constants_1.MarkerConstants.PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
        return state;
    }
}
exports.Phanpy = Phanpy;
