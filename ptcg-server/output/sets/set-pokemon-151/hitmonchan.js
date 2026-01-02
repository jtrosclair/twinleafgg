"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hitmonchan = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Hitmonchan extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 120;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Counterattack',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon is in the Active Spot and is damaged by an attack from your opponent\'s Pokémon(even if this Pokémon is Knocked Out), put 3 damage counters on the Attacking Pokémon.'
            }];
        this.attacks = [{
                name: 'Excited Punch',
                cost: [F, F],
                damage: 60,
                text: 'During your next turn, this Pokémon\'s Excited Punch attack does 60 more damage (before applying Weakness and Resistance).'
            }];
        this.set = 'MEW';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '107';
        this.name = 'Hitmonchan';
        this.fullName = 'Hitmonchan MEW';
        this.NEXT_TURN_MORE_DAMAGE_MARKER = 'NEXT_TURN_MORE_DAMAGE_MARKER';
        this.NEXT_TURN_MORE_DAMAGE_MARKER_2 = 'NEXT_TURN_MORE_DAMAGE_MARKER_2';
        this.usedAttack = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.target.getPokemonCard() === this && state.phase === state_1.GamePhase.ATTACK) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const opponent = effect.player;
            if (player === opponent || player.active !== effect.target)
                return state;
            if (prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
                return state;
            }
            const damageEffect = new game_effects_1.EffectOfAbilityEffect(player, this.powers[0], this, effect.source);
            store.reduceEffect(state, damageEffect);
            if (damageEffect.target) {
                damageEffect.target.damage += 30;
            }
        }
        // Check if the attack was used
        if (effect instanceof game_effects_1.AttackEffect) {
            this.usedAttack = true;
        }
        if (effect instanceof game_phase_effects_1.BeginTurnEffect) {
            if (this.usedAttack) {
                this.usedAttack = false;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            if (!this.usedAttack) {
                this.usedAttack = false;
                effect.player.marker.removeMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this);
                effect.player.marker.removeMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER_2, this);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this)) {
            effect.player.marker.addMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER_2, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            // Check marker
            if (effect.player.marker.hasMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this)) {
                effect.damage += 60;
            }
            effect.player.marker.addMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this);
        }
        return state;
    }
}
exports.Hitmonchan = Hitmonchan;
