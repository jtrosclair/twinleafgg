"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Donphan = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Donphan extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Phanpy';
        this.cardType = F;
        this.hp = 130;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Sturdy',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon has full HP and would be Knocked Out by damage from an attack, this Pokémon is not Knocked Out and its remaining HP becomes 10.'
            }];
        this.attacks = [{
                name: 'Rolling Spin',
                cost: [F, C, C],
                damage: 70,
                text: 'During your next turn, this Pokémon\'s Rolling Spin attack does 70 more damage (before applying Weakness and Resistance).'
            }];
        this.set = 'LOT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '112';
        this.name = 'Donphan';
        this.fullName = 'Donphan LOT';
        this.NEXT_TURN_MORE_DAMAGE_MARKER = 'NEXT_TURN_MORE_DAMAGE_MARKER';
        this.NEXT_TURN_MORE_DAMAGE_MARKER_2 = 'NEXT_TURN_MORE_DAMAGE_MARKER_2';
        this.usedAttack = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            if (!(0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this) && (0, prefabs_1.DAMAGED_FROM_FULL_HP)(store, state, effect, player, effect.target)) {
                effect.surviveOnTenHPReason = this.powers[0].name;
            }
        }
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
                (0, prefabs_1.REMOVE_MARKER)(this.NEXT_TURN_MORE_DAMAGE_MARKER, effect.player, this);
                (0, prefabs_1.REMOVE_MARKER)(this.NEXT_TURN_MORE_DAMAGE_MARKER_2, effect.player, this);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && (0, prefabs_1.HAS_MARKER)(this.NEXT_TURN_MORE_DAMAGE_MARKER, effect.player, this)) {
            (0, prefabs_1.ADD_MARKER)(this.NEXT_TURN_MORE_DAMAGE_MARKER_2, effect.player, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            // Check marker
            if ((0, prefabs_1.HAS_MARKER)(this.NEXT_TURN_MORE_DAMAGE_MARKER, effect.player, this)) {
                effect.damage += 70;
            }
            (0, prefabs_1.ADD_MARKER)(this.NEXT_TURN_MORE_DAMAGE_MARKER, effect.player, this);
        }
        return state;
    }
}
exports.Donphan = Donphan;
