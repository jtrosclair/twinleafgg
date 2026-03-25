"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokeParksMunchlax = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class PokeParksMunchlax extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Defense Curl',
                cost: [C],
                damage: 0,
                text: 'Flip a coin. If heads, prevent all damage done to this Pokémon during your opponent\'s next turn.'
            },
            {
                name: 'Body Slam',
                cost: [C, C, C],
                damage: 30,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
            }];
        this.set = 'PCGP';
        this.name = 'PokéPark\'s Munchlax';
        this.fullName = 'PokéPark\'s Munchlax PCGP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '40';
        this.DEFENSE_CURL_MARKER = 'DEFENSE_CURL_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    this.marker.addMarker(this.DEFENSE_CURL_MARKER, this);
                    (0, prefabs_1.ADD_MARKER)(this.DEFENSE_CURL_MARKER, effect.opponent, this);
                }
            });
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this) && (0, prefabs_1.HAS_MARKER)(this.DEFENSE_CURL_MARKER, effect.target, this)) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const opponent = game_1.StateUtils.findOwner(state, effect.source);
            if (player === opponent) {
                return state;
            }
            // It's not an attack
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            effect.preventDefault = true;
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                }
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && (0, prefabs_1.HAS_MARKER)(this.DEFENSE_CURL_MARKER, effect.player, this)) {
            (0, prefabs_1.REMOVE_MARKER)(this.DEFENSE_CURL_MARKER, effect.player, this);
            this.marker.removeMarker(this.DEFENSE_CURL_MARKER, this);
        }
        return state;
    }
}
exports.PokeParksMunchlax = PokeParksMunchlax;
