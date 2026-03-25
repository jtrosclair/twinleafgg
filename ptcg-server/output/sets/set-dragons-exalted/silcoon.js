"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Silcoon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Silcoon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Wurmple';
        this.cardType = G;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Harden',
                cost: [C],
                damage: 0,
                text: 'During your opponent\'s next turn, if this Pokemon would be damaged by an attack, prevent that attack\'s damage done to this Pokemon if that damage is 60 or less.'
            },
            {
                name: 'Bug Bite',
                cost: [G, C, C],
                damage: 40,
                text: ''
            }
        ];
        this.set = 'DRX';
        this.setNumber = '7';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Silcoon';
        this.fullName = 'Silcoon DRX';
        this.HARDEN_MARKER = 'SILCOON_HARDEN_MARKER';
        this.CLEAR_HARDEN_MARKER = 'SILCOON_CLEAR_HARDEN_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Harden - prevent damage of 60 or less
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.HARDEN_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_HARDEN_MARKER, this);
        }
        // Prevent damage of 60 or less
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.cards.includes(this)) {
            if (effect.target.marker.hasMarker(this.HARDEN_MARKER, this) && effect.damage <= 60) {
                effect.preventDefault = true;
                return state;
            }
        }
        // Cleanup markers at end of opponent's turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && effect.player.marker.hasMarker(this.CLEAR_HARDEN_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_HARDEN_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.HARDEN_MARKER, this);
            });
        }
        return state;
    }
}
exports.Silcoon = Silcoon;
