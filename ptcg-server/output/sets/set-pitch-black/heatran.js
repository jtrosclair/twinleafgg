"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Heatran = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
class Heatran extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 140;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C, C];
        this.LAVA_WALL_MARKER = 'M5_HEATRAN_LAVA_WALL';
        this.CLEAR_LAVA_WALL = 'M5_HEATRAN_CLEAR_LAVA';
        this.attacks = [{
                name: 'Singe',
                cost: [R],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Burned.',
            },
            {
                name: 'Lava Wall',
                cost: [R, R, C],
                damage: 120,
                text: 'During your opponent\'s next turn, this Pokémon doesn\'t take damage from attacks by Pokémon that are Burned.',
            }];
        this.set = 'M5';
        this.setNumber = '7';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Heatran';
        this.fullName = 'Heatran M5';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_2.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED)(store, state, effect);
        }
        // Ref: set-astral-radiance/glaceon.ts (Frost Wall — 2-marker + opponent-clear pattern)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.LAVA_WALL_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_LAVA_WALL, this);
        }
        if ((effect instanceof attack_effects_1.DealDamageEffect || effect instanceof attack_effects_1.PutDamageEffect)
            && effect.target.marker.hasMarker(this.LAVA_WALL_MARKER, this)
            && effect.source.getPokemonCard() !== undefined) {
            const burnOnAttacker = effect.source.specialConditions.includes(card_types_1.SpecialCondition.BURNED);
            if (burnOnAttacker) {
                effect.preventDefault = true;
                return state;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_LAVA_WALL, this)) {
            effect.player.marker.removeMarker(this.CLEAR_LAVA_WALL, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, cardList => {
                cardList.marker.removeMarker(this.LAVA_WALL_MARKER, this);
            });
        }
        return state;
    }
}
exports.Heatran = Heatran;
