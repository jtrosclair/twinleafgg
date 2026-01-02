"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meloettaex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
// Energy type constants (P, C, D, F) are assumed to be globally available as in other SV11B cards
class Meloettaex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardTag = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = P;
        this.hp = 200;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Live Debut',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'If you go first, this Pokémon can attack on your first turn.'
            }];
        this.attacks = [{
                name: 'Echoed Voice',
                cost: [P],
                damage: 30,
                text: 'During your next turn, this Pokémon\'s Echoed Voice attack does 80 more damage (before applying Weakness and Resistance).'
            }];
        this.regulationMark = 'I';
        this.set = 'BLK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '44';
        this.name = 'Meloetta ex';
        this.fullName = 'Meloetta ex SV11B';
        this.usedAttack = false;
        this.NEXT_TURN_MORE_DAMAGE_MARKER = 'NEXT_TURN_MORE_DAMAGE_MARKER';
        this.NEXT_TURN_MORE_DAMAGE_MARKER_2 = 'NEXT_TURN_MORE_DAMAGE_MARKER_2';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseAttackEffect && effect.player.active.cards.includes(this) && state.turn === 1) {
            if (prefabs_1.IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
                return state;
            }
            effect.attack.canUseOnFirstTurn = true;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            this.usedAttack = true;
        }
        if (effect instanceof game_phase_effects_1.BeginTurnEffect && this.usedAttack) {
            this.usedAttack = false;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && !this.usedAttack) {
            this.usedAttack = false;
            prefabs_1.REMOVE_MARKER(this.NEXT_TURN_MORE_DAMAGE_MARKER, effect.player, this);
            prefabs_1.REMOVE_MARKER(this.NEXT_TURN_MORE_DAMAGE_MARKER_2, effect.player, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && prefabs_1.HAS_MARKER(this.NEXT_TURN_MORE_DAMAGE_MARKER, effect.player, this)) {
            prefabs_1.ADD_MARKER(this.NEXT_TURN_MORE_DAMAGE_MARKER_2, effect.player, this);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            // Check marker
            if (prefabs_1.HAS_MARKER(this.NEXT_TURN_MORE_DAMAGE_MARKER, effect.player, this)) {
                effect.damage += 80;
            }
            prefabs_1.ADD_MARKER(this.NEXT_TURN_MORE_DAMAGE_MARKER, effect.player, this);
        }
        return state;
    }
}
exports.Meloettaex = Meloettaex;
