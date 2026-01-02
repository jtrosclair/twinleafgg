"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keldeoex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Keldeoex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.cardType = W;
        this.hp = 210;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Gale Thrust',
                cost: [W, C],
                damage: 30,
                damageCalculation: '+',
                text: 'If this Pokémon moved from the Bench to the Active Spot this turn, this attack does 90 more damage.'
            },
            {
                name: 'Sonic Edge',
                cost: [W, C, C],
                damage: 120,
                shredAttack: true,
                text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
            }];
        this.regulationMark = 'I';
        this.set = 'WHT';
        this.setNumber = '30';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Keldeo ex';
        this.fullName = 'Keldeo ex SV11W';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect && this.movedToActiveThisTurn) {
            this.movedToActiveThisTurn = false;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            if (this.movedToActiveThisTurn) {
                effect.damage += 120;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect, 120);
            store.reduceEffect(state, applyWeakness);
            const damage = applyWeakness.damage;
            effect.damage = 0;
            if (damage > 0) {
                opponent.active.damage += damage;
                const afterDamage = new attack_effects_1.AfterDamageEffect(effect, damage);
                state = store.reduceEffect(state, afterDamage);
            }
        }
        return state;
    }
}
exports.Keldeoex = Keldeoex;
