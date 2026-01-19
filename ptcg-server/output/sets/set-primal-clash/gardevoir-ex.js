"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GardevoirEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class GardevoirEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = Y;
        this.hp = 170;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Life Leap',
                cost: [Y],
                damage: 20,
                text: 'Heal from this Pokémon the same amount of damage you did to your opponent\'s Active Pokémon.'
            }, {
                name: 'Shining Wind',
                cost: [Y, Y, Y],
                damage: 100,
                text: 'During your opponent\'s next turn, this Pokémon has no Weakness.'
            },
        ];
        this.set = 'PRC';
        this.name = 'Gardevoir-EX';
        this.fullName = 'Gardevoir EX PRC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '105';
        this.SHINING_WIND_MARKER = 'SHINING_WIND_MARKER';
        this.CLEAR_SHINING_WIND_MARKER = 'CLEAR_SHINING_WIND_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Life Leap
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const healTargetEffect = new attack_effects_1.HealTargetEffect(effect, effect.damage);
            healTargetEffect.target = player.active;
            state = store.reduceEffect(state, healTargetEffect);
        }
        // Shining Wind
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            player.active.marker.addMarker(this.SHINING_WIND_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_SHINING_WIND_MARKER, this);
        }
        if (effect instanceof check_effects_1.CheckPokemonStatsEffect) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            if (player.active.marker.hasMarker(this.SHINING_WIND_MARKER, this)) {
                effect.weakness = [];
                return state;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && effect.player.marker.hasMarker(this.CLEAR_SHINING_WIND_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_SHINING_WIND_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.SHINING_WIND_MARKER, this);
            });
        }
        return state;
    }
}
exports.GardevoirEx = GardevoirEx;
