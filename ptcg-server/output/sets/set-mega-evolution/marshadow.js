"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Marshadow = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Marshadow extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Shadowy Side Kick',
                cost: [F, F],
                damage: 60,
                text: 'If your opponent\'s Pokémon is Knocked Out by damage from this attack, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
            }];
        this.set = 'MEG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '80';
        this.name = 'Marshadow';
        this.fullName = 'Marshadow M1L';
        this.regulationMark = 'I';
        this.PREVENT_ALL_DAMAGE_AND_EFFECTS = 'PREVENT_ALL_DAMAGE_AND_EFFECTS';
        this.CLEAR_PREVENT_ALL_DAMAGE_AND_EFFECTS = 'CLEAR_PREVENT_ALL_DAMAGE_AND_EFFECTS';
        this.usedShadowySideKick = false;
    }
    reduceEffect(store, state, effect) {
        // Attack: Shadowy Side Kick
        // Ref: set-plasma-freeze/kakuna.ts (prevent damage/effects), set-crimson-invasion/guzzlord-gx.ts (KO-conditional flag)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            this.usedShadowySideKick = true;
        }
        // If opponent's Pokemon KO'd by this attack, add prevention marker
        if (effect instanceof game_effects_1.KnockOutEffect && this.usedShadowySideKick) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (state.phase === game_1.GamePhase.ATTACK && effect.target === opponent.active && effect.target.getPokemonCard()) {
                player.active.marker.addMarker(this.PREVENT_ALL_DAMAGE_AND_EFFECTS, this);
                opponent.marker.addMarker(this.CLEAR_PREVENT_ALL_DAMAGE_AND_EFFECTS, this);
            }
            this.usedShadowySideKick = false;
        }
        // Prevent damage and effects when marker is set
        // Ref: set-cosmic-eclipse/alolan-persian-gx.ts (Smug Face - AbstractAttackEffect for all effects)
        if (effect instanceof attack_effects_1.AbstractAttackEffect
            && effect.target.cards.includes(this)
            && effect.target.marker.hasMarker(this.PREVENT_ALL_DAMAGE_AND_EFFECTS, this)) {
            effect.preventDefault = true;
            return state;
        }
        // Cleanup at end of opponent's turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_PREVENT_ALL_DAMAGE_AND_EFFECTS, this)) {
            effect.player.marker.removeMarker(this.CLEAR_PREVENT_ALL_DAMAGE_AND_EFFECTS, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.PREVENT_ALL_DAMAGE_AND_EFFECTS, this);
            });
        }
        // Reset flag at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            this.usedShadowySideKick = false;
        }
        return state;
    }
}
exports.Marshadow = Marshadow;
