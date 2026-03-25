"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IronDefender = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class IronDefender extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'MEG';
        this.setNumber = '118';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'I';
        this.name = 'Iron Defender';
        this.fullName = 'Iron Defender M1L';
        this.text = 'During your opponent\'s next turn, all of your [M] Pokémon take 30 less damage from attacks from your opponent\'s Pokémon (after applying Weakness and Resistance). (This includes new Pokémon that come into play.)';
        this.IRON_DEFENDER_MARKER = 'IRON_DEFENDER_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            effect.player.marker.addMarker(this.IRON_DEFENDER_MARKER, this);
        }
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = state_utils_1.StateUtils.findOwner(state, state_utils_1.StateUtils.findCardList(state, this));
            const hasMarker = player.marker.hasMarker(this.IRON_DEFENDER_MARKER, this);
            const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            store.reduceEffect(state, checkPokemonTypeEffect);
            if (hasMarker && checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.METAL)) {
                effect.damage -= 30;
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            state_utils_1.StateUtils.getOpponent(state, effect.player).marker.removeMarker(this.IRON_DEFENDER_MARKER);
        }
        return state;
    }
}
exports.IronDefender = IronDefender;
