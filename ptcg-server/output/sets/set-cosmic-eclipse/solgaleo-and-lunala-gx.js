"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolgaleoLunalaGX = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class SolgaleoLunalaGX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.POKEMON_GX, game_1.CardTag.TAG_TEAM];
        this.stage = game_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 270;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Cosmic Burn',
                cost: [P, P, P, C],
                damage: 230,
                text: 'This Pokémon can\'t use Cosmic Burn during your next turn.'
            },
            {
                name: 'Light of the Protector-GX',
                cost: [P, P, C],
                damage: 200,
                gxAttack: true,
                text: 'If you played Lillie\'s Full Force from your hand during this turn, prevent all effects of attacks, including damage, done to each of your Pokémon during your opponent\'s next turn. (You can\'t use more than 1 GX attack in a game.)'
            },
        ];
        this.set = 'CEC';
        this.setNumber = '75';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Solgaleo & Lunala-GX';
        this.fullName = 'Solgaleo & Lunala-GX CEC';
        this.COSMIC_BURN_MARKER = 'COSMIC_BURN_MARKER';
        this.CLEAR_COSMIC_BURN_MARKER = 'CLEAR_COSMIC_BURN_MARKER';
        this.PLAYED_LILLIES_FULL_FORCE_MARKER = 'PLAYED_LILLIES_FULL_FORCE_MARKER';
        this.LIGHT_OF_THE_PROTECTOR_MARKER = 'LIGHT_OF_THE_PROTECTOR_MARKER';
        this.CLEAR_LIGHT_OF_THE_PROTECTOR_MARKER = 'CLEAR_LIGHT_OF_THE_PROTECTOR_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Cosmic Burn
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            if (effect.player.active.marker.hasMarker(this.COSMIC_BURN_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            effect.player.active.marker.addMarker(this.COSMIC_BURN_MARKER, this);
        }
        // Light of the Protector-GX
        if (effect instanceof play_card_effects_1.PlaySupporterEffect) {
            const player = effect.player;
            if (effect.trainerCard.name === 'Lillie\'s Full Force') {
                player.marker.addMarker(this.PLAYED_LILLIES_FULL_FORCE_MARKER, this);
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            (0, prefabs_1.BLOCK_IF_GX_ATTACK_USED)(player);
            player.usedGX = true;
            if (player.marker.hasMarker(this.PLAYED_LILLIES_FULL_FORCE_MARKER, this)) {
                player.marker.addMarker(this.LIGHT_OF_THE_PROTECTOR_MARKER, this);
                opponent.marker.addMarker(this.CLEAR_LIGHT_OF_THE_PROTECTOR_MARKER, this);
            }
        }
        // Cosmic Burn Marker things
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_COSMIC_BURN_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_COSMIC_BURN_MARKER, this);
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                if (card.marker.hasMarker(this.COSMIC_BURN_MARKER, this)) {
                    card.marker.removeMarker(this.COSMIC_BURN_MARKER, this);
                }
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.active.marker.hasMarker(this.COSMIC_BURN_MARKER, this)) {
            effect.player.marker.addMarker(this.CLEAR_COSMIC_BURN_MARKER, this);
        }
        // Light of the Protector
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_LIGHT_OF_THE_PROTECTOR_MARKER, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            effect.player.marker.removeMarker(this.CLEAR_LIGHT_OF_THE_PROTECTOR_MARKER, this);
            opponent.marker.removeMarker(this.LIGHT_OF_THE_PROTECTOR_MARKER, this);
        }
        if ((effect instanceof attack_effects_1.PutDamageEffect
            || effect instanceof attack_effects_1.PutCountersEffect
            || effect instanceof attack_effects_1.AddSpecialConditionsEffect) && effect.opponent.marker.hasMarker(this.LIGHT_OF_THE_PROTECTOR_MARKER, this)) {
            effect.preventDefault = true;
        }
        return state;
    }
}
exports.SolgaleoLunalaGX = SolgaleoLunalaGX;
