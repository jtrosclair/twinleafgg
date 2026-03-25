"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sawk = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Sawk extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Defensive Stance',
                cost: [C],
                damage: 0,
                text: 'Heal 30 damage from this Pokémon. Switch this Pokémon with 1 of your Benched Pokémon.'
            },
            {
                name: 'Karate Chop',
                cost: [F, C, C],
                damage: 70,
                damageCalculation: '-',
                text: 'Does 70 damage minus 10 damage for each damage counter on this Pokémon.'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '69';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Sawk';
        this.fullName = 'Sawk DRX';
        this.usedDefensiveStance = false;
    }
    reduceEffect(store, state, effect) {
        // Defensive Stance - heal 30, then switch after attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect, store, state, 30);
            this.usedDefensiveStance = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedDefensiveStance) {
            this.usedDefensiveStance = false;
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (hasBench) {
                (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, player);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && this.usedDefensiveStance) {
            this.usedDefensiveStance = false;
        }
        // Karate Chop - 70 minus 10 per damage counter on this Pokemon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const damageCounters = Math.floor(player.active.damage / 10);
            effect.damage = Math.max(0, 70 - (10 * damageCounters));
        }
        return state;
    }
}
exports.Sawk = Sawk;
