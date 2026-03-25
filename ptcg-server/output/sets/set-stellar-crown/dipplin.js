"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Terapagosex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Terapagosex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Coated Attack',
                cost: [G],
                damage: 20,
                text: 'During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from Basic Pokémon.'
            }];
        this.set = 'SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '13';
        this.name = 'Dipplin';
        this.fullName = 'Dipplin SCR';
        this.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER = 'PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER';
        this.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER = 'CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER, this);
            return state;
        }
        if (effect instanceof attack_effects_1.PutDamageEffect
            && effect.target.marker.hasMarker(this.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER)) {
            const card = effect.source.getPokemonCard();
            const stage = card !== undefined ? card.stage : undefined;
            if (stage === card_types_1.Stage.BASIC) {
                effect.preventDefault = true;
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            if (effect.player.marker.hasMarker(this.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER, this)) {
                effect.player.marker.removeMarker(this.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER, this);
                const opponent = game_1.StateUtils.getOpponent(state, effect.player);
                opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                    cardList.marker.removeMarker(this.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER, this);
                });
            }
        }
        return state;
    }
}
exports.Terapagosex = Terapagosex;
