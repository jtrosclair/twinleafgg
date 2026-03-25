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
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.target.getPokemonCard() === this && state.phase === state_1.GamePhase.ATTACK) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const opponent = effect.player;
            if (player === opponent || player.active !== effect.target)
                return state;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const damageEffect = new game_effects_1.EffectOfAbilityEffect(player, this.powers[0], this, effect.source);
            store.reduceEffect(state, damageEffect);
            if (damageEffect.target) {
                damageEffect.target.damage += 30;
            }
        }
        // Refs: set-boundaries-crossed/watchog.ts (Psych Up), prefabs/prefabs.ts (NEXT_TURN_ATTACK_BONUS)
        (0, prefabs_1.NEXT_TURN_ATTACK_BONUS)(effect, {
            attack: this.attacks[0],
            source: this,
            bonusDamage: 60,
            bonusMarker: this.NEXT_TURN_MORE_DAMAGE_MARKER,
            clearMarker: this.NEXT_TURN_MORE_DAMAGE_MARKER_2
        });
        return state;
    }
}
exports.Hitmonchan = Hitmonchan;
